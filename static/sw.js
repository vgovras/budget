const CACHE_NAME = 'budget-v3';

// --- Install & Activate ---

self.addEventListener('install', () => {
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) =>
			Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
		)
	);
	self.clients.claim();
});

// --- Fetch: caching strategies ---

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	// Navigation requests — network first
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					const clone = response.clone();
					caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
					return response;
				})
				.catch(() => caches.match(event.request))
		);
		return;
	}

	// Static assets — cache first
	if (
		url.pathname.startsWith('/_app/') ||
		url.pathname.startsWith('/icon-') ||
		url.pathname === '/manifest.json'
	) {
		event.respondWith(
			caches.match(event.request).then((cached) => {
				if (cached) return cached;
				return fetch(event.request).then((response) => {
					if (response.ok) {
						const clone = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
					}
					return response;
				});
			})
		);
		return;
	}
});

// --- Background Sync: push pending requests ---

function openSyncDB() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open('budget-sync', 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore('pending', { autoIncrement: true });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function pushPending() {
	const db = await openSyncDB();
	const tx = db.transaction('pending', 'readwrite');
	const store = tx.objectStore('pending');

	const items = await new Promise((resolve, reject) => {
		const req = store.getAll();
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});

	const keys = await new Promise((resolve, reject) => {
		const req = store.getAllKeys();
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});

	console.log('[sw] pushing', items.length, 'pending items');

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		try {
			const res = await fetch(item.url, {
				method: item.method,
				headers: item.body ? { 'Content-Type': 'application/json' } : undefined,
				body: item.body ? JSON.stringify(item.body) : undefined
			});

			if (res.ok || res.status === 409) {
				// Success or conflict (duplicate) — remove from queue
				const delTx = db.transaction('pending', 'readwrite');
				delTx.objectStore('pending').delete(keys[i]);
				await new Promise((r) => (delTx.oncomplete = r));
				console.log('[sw] pushed:', item.method, item.url);
			} else {
				console.warn('[sw] push failed:', res.status, item.method, item.url);
			}
		} catch (e) {
			console.warn('[sw] push error:', item.method, item.url, e.message);
			// Stop retrying — will be retried on next sync event
			break;
		}
	}

	db.close();
}

self.addEventListener('sync', (event) => {
	if (event.tag === 'push-pending') {
		console.log('[sw] sync event: push-pending');
		event.waitUntil(pushPending());
	}
});

// --- Periodic Sync (Chrome PWA only) ---

self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'sync-periodic') {
		console.log('[sw] periodic sync');
		event.waitUntil(pushPending());
	}
});

// --- Message handler for manual sync trigger ---

self.addEventListener('message', (event) => {
	if (event.data === 'push-pending') {
		console.log('[sw] manual sync trigger');
		pushPending();
	}
});
