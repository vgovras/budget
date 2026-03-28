import { authClient } from '$lib/auth-client.js';
import { getLocalData, saveLocalData } from './store.js';

let isLoggedIn = false;

authClient.useSession().subscribe((session) => {
	const nowLoggedIn = !!session.data;
	if (nowLoggedIn && !isLoggedIn) {
		// First login — sync immediately
		syncWithServer();
	}
	isLoggedIn = nowLoggedIn;
	console.log('[sync] session changed, isLoggedIn:', isLoggedIn);
});

export async function syncWithServer(): Promise<void> {
	if (!isLoggedIn || !navigator.onLine) return;

	try {
		console.log('[sync] pushing...');
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(getLocalData())
		});
		if (!res.ok) {
			console.warn('[sync] failed:', res.status);
			return;
		}
		const { merged } = await res.json();
		saveLocalData(merged);
		console.log('[sync] ok');
	} catch (e) {
		console.warn('[sync] error:', (e as Error).message);
	}
}

export function startSync(): void {
	syncWithServer();
	window.addEventListener('online', () => syncWithServer());
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') syncWithServer();
	});
	setInterval(() => syncWithServer(), 30_000);
}
