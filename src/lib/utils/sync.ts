import { authClient } from '$lib/auth-client.js';

let isLoggedIn = false;

authClient.useSession().subscribe((session) => {
	isLoggedIn = !!session.data;
	console.log('[sync] session changed, isLoggedIn:', isLoggedIn);
});

// --- IndexedDB for pending sync queue (SW-accessible) ---

function openSyncDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open('budget-sync', 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore('pending', { autoIncrement: true });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function queueForSync(url: string, method: string, body?: unknown) {
	try {
		const db = await openSyncDB();
		const tx = db.transaction('pending', 'readwrite');
		tx.objectStore('pending').add({ url, method, body, timestamp: Date.now() });
		await new Promise((res, rej) => {
			tx.oncomplete = res;
			tx.onerror = rej;
		});
		db.close();
		console.log('[sync] queued for background sync:', method, url);

		// Register Background Sync if available
		const reg = await navigator.serviceWorker?.ready;
		if (reg?.sync) {
			await reg.sync.register('push-pending');
			console.log('[sync] background sync registered');
		}
	} catch (e) {
		console.warn('[sync] failed to queue:', (e as Error).message);
	}
}

// --- Main sync function ---

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
		.catch(() => {
			// Offline or network error — queue for background sync
			console.log('[sync] offline, queuing:', method, url);
			queueForSync(url, method, body);
		});
}
