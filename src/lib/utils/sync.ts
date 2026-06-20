import { authClient } from '$lib/auth-client.js';
import { getLocalData, saveLocalData } from './store.js';
import { mergeUserData } from './merge.js';

const POLL_INTERVAL = 15_000;
const DEBOUNCE = 300;

let isLoggedIn = false;
let dirty = false;
let inFlight = false;
let queued = false;
let started = false;
let mutationVersion = 0;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let onPull: (() => void) | null = null;

authClient.useSession().subscribe((session) => {
	isLoggedIn = !!session.data;
});

/** Mark local data as changed. Triggers an immediate (debounced) sync when online. */
export function markDirty(): void {
	dirty = true;
	mutationVersion++;
	scheduleImmediate();
}

/** Register callback to rehydrate VMs after data changes are applied locally. */
export function onSyncPull(cb: () => void): void {
	onPull = cb;
}

/** Start sync: initial sync + periodic poll + online/visibility triggers. */
export function startSync(): void {
	if (started) return;
	started = true;

	void sync();
	setInterval(() => void sync(), POLL_INTERVAL);

	window.addEventListener('online', () => void sync());
	document.addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'visible') void sync();
	});
}

/** Force an immediate sync (e.g. after onboarding finishes). */
export function syncNow(): void {
	dirty = true;
	void sync();
}

function scheduleImmediate(): void {
	if (debounceTimer) clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => void sync(), DEBOUNCE);
}

function canSync(): boolean {
	if (!isLoggedIn || !navigator.onLine) return false;
	const d = getLocalData();
	return !!d.settings.onboardingCompletedAt || Object.keys(d.accounts).length > 0;
}

/**
 * Single serialized bidirectional sync.
 * POST is itself a two-way merge on the server (merge(server, client) → merged),
 * so one request covers both push and pull. The server response is re-merged with
 * the *current* local data so edits made during the request are never lost, and the
 * dirty flag is only cleared when no new mutation happened mid-flight.
 */
async function sync(): Promise<void> {
	if (!canSync() || inFlight) {
		if (inFlight) queued = true;
		return;
	}
	inFlight = true;

	try {
		const before = mutationVersion;

		const res = await fetch('/api/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(getLocalData())
		});

		if (res.ok) {
			const { merged } = await res.json();
			const current = getLocalData();
			const next = mergeUserData(merged, current);

			if (JSON.stringify(next) !== JSON.stringify(current)) {
				saveLocalData(next);
				onPull?.();
			}

			// Only consider local clean if nothing changed while the request was in flight.
			if (mutationVersion === before) dirty = false;
		}
	} catch {
		/* offline / network error — keep dirty, retry on next trigger */
	} finally {
		inFlight = false;
		if (queued || dirty) {
			queued = false;
			void sync();
		}
	}
}
