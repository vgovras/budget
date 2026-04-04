import { authClient } from '$lib/auth-client.js';
import { getLocalData, saveLocalData } from './store.js';

const LAST_SYNC_KEY = 'budget:lastSync';
const SYNC_INTERVAL = 30_000;

let isLoggedIn = false;
let lastSyncFailed = false;
let dirty = false;
let syncing = false;

function getLastSync(): number {
	return Number(localStorage.getItem(LAST_SYNC_KEY) || '0');
}

function setLastSync(): void {
	localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
}

authClient.useSession().subscribe((session) => {
	const nowLoggedIn = !!session.data;
	if (nowLoggedIn && !isLoggedIn) {
		dirty = true;
		syncWithServer();
	}
	isLoggedIn = nowLoggedIn;
});

export function markDirty(): void {
	dirty = true;
	syncWithServer();
}

export async function syncWithServer(): Promise<void> {
	console.log('[sync] attempting sync... isLoggedIn:', isLoggedIn, 
		'online:', navigator.onLine, 
		'dirty:', dirty, 
		'lastSyncFailed:', lastSyncFailed, 
		'syncing:', syncing
	);

	// if (!isLoggedIn || !navigator.onLine) return;
	// if (!dirty && !lastSyncFailed) return;
	// if (syncing) return;
	// syncing = true;

	console.log('[sync] data: ', getLocalData());

	try {
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(getLocalData())
		});
		if (!res.ok) {
			lastSyncFailed = true;
			console.warn('[sync] failed:', res.status);
			return;
		}
		const { merged } = await res.json();
		saveLocalData(merged);
		setLastSync();
		lastSyncFailed = false;
		dirty = false;
		console.log('[sync] ok');
	} catch (e) {
		lastSyncFailed = true;
		console.warn('[sync] error:', (e as Error).message);
	} finally {
		syncing = false;
	}
}

let started = false;

export function startSync(): void {
	if (started) return;
	started = true;

	// Sync if never synced or last sync was more than interval ago
	const elapsed = Date.now() - getLastSync();
	if (elapsed > SYNC_INTERVAL) {
		dirty = true;
	}

	syncWithServer();
	window.addEventListener('online', () => {
		lastSyncFailed = false;
		syncWithServer();
	});
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') {
			lastSyncFailed = false;
			dirty = true;
			syncWithServer();
		}
	});
	setInterval(() => syncWithServer(), SYNC_INTERVAL);
}
