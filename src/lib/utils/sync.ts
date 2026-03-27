import { authClient } from '$lib/auth-client.js';

let isLoggedIn = false;

authClient.useSession().subscribe((session) => {
	isLoggedIn = !!session.data;
	console.log('[sync] session changed, isLoggedIn:', isLoggedIn);
});

export function syncToServer(
	url: string,
	method: 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST',
	body?: unknown
): void {
	if (!isLoggedIn) {
		console.log('[sync] skip (not logged in):', method, url);
		return;
	}

	console.log('[sync]', method, url, body ? JSON.stringify(body).slice(0, 100) + '...' : '');

	fetch(url, {
		method,
		headers: body ? { 'Content-Type': 'application/json' } : undefined,
		body: body ? JSON.stringify(body) : undefined
	})
		.then((res) => {
			if (!res.ok) console.warn('[sync] failed:', res.status, method, url);
			else console.log('[sync] ok:', method, url);
		})
		.catch((err) => {
			console.warn('[sync] error:', method, url, err.message);
		});
}
