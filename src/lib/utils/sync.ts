import { authClient } from '$lib/auth-client.js';

let isLoggedIn = false;
let wasLoggedIn = false;

authClient.useSession().subscribe((session) => {
	const nowLoggedIn = !!session.data;
	console.log('[sync] session changed, isLoggedIn:', nowLoggedIn);

	// First login on this device — push all local data
	if (nowLoggedIn && !wasLoggedIn) {
		isLoggedIn = true;
		initialMerge();
	}

	isLoggedIn = nowLoggedIn;
	wasLoggedIn = nowLoggedIn;
});

// --- Initial merge: push all localStorage data to server ---

async function initialMerge() {
	console.log('[sync] initial merge — pushing all local data');

	try {
		const load = (key: string) => {
			try {
				const raw = localStorage.getItem(key);
				return raw ? JSON.parse(raw) : null;
			} catch {
				return null;
			}
		};

		const expData = load('budget:expenses');
		const accounts = load('budget:accounts');
		const settings = load('budget:settings');
		const categories = load('budget:categories');
		const subscriptions = load('budget:subscriptions');
		const recurring = load('budget:recurring');

		// Map local expenses to transaction format
		const transactions = (expData?.expenses ?? []).map((exp: any) => ({
			accountId: exp.accountId,
			type: exp.type === 'income' ? 'IN' : 'OUT',
			subtype: exp.type.toUpperCase(),
			amount: exp.amount,
			icon: exp.icon,
			label: exp.label,
			note: exp.note,
			createdAt: exp.date || new Date().toISOString(),
			meta: {
				localId: exp.id,
				commission: exp.commission,
				netAmount: exp.netAmount,
				toAccountId: exp.toAccountId,
				exchangeRate: exp.exchangeRate,
				displayAmount: exp.displayAmount,
				displayCurrency: exp.displayCurrency
			}
		}));

		const res = await fetch('/api/merge', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				accounts,
				transactions,
				settings,
				categories,
				subscriptions,
				recurring
			})
		});

		if (res.ok) console.log('[sync] initial merge ok');
		else console.warn('[sync] initial merge failed:', res.status);
	} catch (e) {
		console.warn('[sync] initial merge error:', (e as Error).message);
	}
}

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
			console.log('[sync] offline, queuing:', method, url);
			queueForSync(url, method, body);
		});
}
