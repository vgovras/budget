import { authClient } from '$lib/auth-client.js';
import { getLocalData, saveLocalData } from './store.js';
import type { UserData } from '$lib/types.js';

const PUSH_INTERVAL = 1_000;
const PULL_INTERVAL = 5_000;

let isLoggedIn = false;
let dirty = false;
let syncing = false;
let started = false;
let onPull: (() => void) | null = null;

authClient.useSession().subscribe((session) => {
	isLoggedIn = !!session.data;
});

/** Mark data as changed. Push cycle picks it up within 1s. */
export function markDirty(): void {
	dirty = true;
}

/** Register callback to rehydrate VMs after pull. */
export function onSyncPull(cb: () => void): void {
	onPull = cb;
}

/** Start both cycles: push (1s) + pull (5s). */
export function startSync(): void {
	if (started) return;
	started = true;

	push();
	pull();

	setInterval(push, PUSH_INTERVAL);
	setInterval(pull, PULL_INTERVAL);

	window.addEventListener('online', () => push());
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') pull();
	});
}

/** Force immediate push (e.g. after onboarding finishes). */
export function syncNow(): void {
	dirty = true;
	push();
}

function canSync(): boolean {
	if (!isLoggedIn || !navigator.onLine || syncing) return false;
	const data = getLocalData();
	return !!data.settings.onboardingCompletedAt || Object.keys(data.accounts).length > 0;
}

function hasChanges(a: UserData, b: UserData): boolean {
	return a.expenses !== b.expenses
		|| a.accounts !== b.accounts
		|| a.categories !== b.categories
		|| a.subscriptions !== b.subscriptions
		|| a.recurring !== b.recurring
		|| JSON.stringify(a.settings) !== JSON.stringify(b.settings);
}

/** Push local changes to server. Fires every 1s, skips if nothing changed. */
async function push(): Promise<void> {
	if (!dirty || !canSync()) return;
	syncing = true;

	try {
		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(getLocalData())
		});

		if (!res.ok) return;

		const { merged } = await res.json();
		saveLocalData(merged);
		dirty = false;
		console.log('[sync] pushed');
	} catch (e) {
		console.warn('[sync:push] error:', (e as Error).message);
	} finally {
		syncing = false;
	}
}

/** Pull latest from server (read-only). Fires every 5s. */
async function pull(): Promise<void> {
	if (!canSync()) return;
	syncing = true;

	try {
		const res = await fetch('/api/sync');
		if (!res.ok) return;

		const { exists, data } = await res.json() as { exists: boolean; data?: UserData };
		if (!exists || !data) return;

		const local = getLocalData();
		if (!hasChanges(data, local)) return;

		saveLocalData(data);
		onPull?.();
		console.log('[sync] pulled');
	} catch {
		// silent — pull is best-effort
	} finally {
		syncing = false;
	}
}
