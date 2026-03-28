import type { UserData } from '$lib/types.js';
import { DEFAULT_SETTINGS, DEFAULT_CATEGORIES } from '$lib/constants.js';
import { uuidv7 } from 'uuidv7';

const KEY = 'budget:data';
const VERSION_KEY = 'budget:version';
const CURRENT_VERSION = '0.0.2';

const DEFAULT_DATA: UserData = {
	expenses: {},
	accounts: {},
	categories: {},
	subscriptions: {},
	recurring: {},
	settings: DEFAULT_SETTINGS,
	syncedAt: ''
};

// --- Version comparison ---

function parseVersion(v: string): number[] {
	return v.split('.').map(Number);
}

function versionLessThan(a: string, b: string): boolean {
	const pa = parseVersion(a);
	const pb = parseVersion(b);
	for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
		const na = pa[i] ?? 0;
		const nb = pb[i] ?? 0;
		if (na < nb) return true;
		if (na > nb) return false;
	}
	return false;
}

// --- Migrations ---

function arrayToRecord<T extends { id: string }>(arr: T[]): Record<string, T> {
	const record: Record<string, T> = {};
	for (const item of arr) record[item.id] = item;
	return record;
}

function migrateFrom0(data: UserData): UserData {
	const now = new Date().toISOString();

	// Old expenses: { expenses: Expense[], nextId: number } — Expense.id was number
	const rawExpenses = localStorage.getItem('budget:expenses');
	const oldExpenses = rawExpenses ? JSON.parse(rawExpenses) : null;
	if (oldExpenses?.expenses) {
		for (const e of oldExpenses.expenses) {
			const id = typeof e.id === 'number' ? uuidv7() : String(e.id);
			data.expenses[id] = { ...e, id, updatedAt: e.updatedAt ?? now };
		}
	}

	// Old accounts: Account[] — had currency instead of currencyCode
	const rawAccounts = localStorage.getItem('budget:accounts');
	const oldAccounts: any[] = rawAccounts ? JSON.parse(rawAccounts) : [];
	for (const a of oldAccounts) {
		const id = a.id.startsWith('acc-') ? uuidv7() : a.id;
		data.accounts[id] = {
			...a,
			id,
			currencyCode: a.currencyCode ?? a.currency ?? '₴',
			updatedAt: a.updatedAt ?? now
		};
		if (id !== a.id) {
			for (const exp of Object.values(data.expenses)) {
				if (exp.accountId === a.id) exp.accountId = id;
			}
		}
	}

	// Old settings
	const rawSettings = localStorage.getItem('budget:settings');
	const oldSettings = rawSettings ? JSON.parse(rawSettings) : null;
	if (oldSettings) {
		Object.assign(data.settings, oldSettings);
		if ('onboardingDone' in oldSettings && !('onboardingCompletedAt' in oldSettings)) {
			(data.settings as any).onboardingCompletedAt = oldSettings.onboardingDone ? now : null;
		}
	}

	const rawCats = localStorage.getItem('budget:categories');
	const oldCats: any[] = rawCats ? JSON.parse(rawCats) : [];
	data.categories = arrayToRecord(oldCats.map((c: any) => ({ ...c, updatedAt: c.updatedAt ?? now })));

	const rawSubs = localStorage.getItem('budget:subscriptions');
	const oldSubs: any[] = rawSubs ? JSON.parse(rawSubs) : [];
	data.subscriptions = arrayToRecord(oldSubs.map((s: any) => ({ ...s, updatedAt: s.updatedAt ?? now })));

	const rawRec = localStorage.getItem('budget:recurring');
	const oldRec: any[] = rawRec ? JSON.parse(rawRec) : [];
	data.recurring = arrayToRecord(oldRec.map((r: any) => ({ ...r, updatedAt: r.updatedAt ?? now })));

	// Cleanup old keys
	localStorage.removeItem('budget:expenses');
	localStorage.removeItem('budget:accounts');
	localStorage.removeItem('budget:settings');
	localStorage.removeItem('budget:categories');
	localStorage.removeItem('budget:subscriptions');
	localStorage.removeItem('budget:recurring');

	console.log('[store] migrated from legacy to 0.0.1');
	return data;
}

function migrateFrom001(data: UserData): UserData {
	const now = new Date().toISOString();

	// Seed default categories if empty
	if (Object.keys(data.categories).length === 0) {
		for (const cat of DEFAULT_CATEGORIES) {
			data.categories[cat.id] = { ...cat, updatedAt: now };
		}
	}

	console.log('[store] migrated from 0.0.1 to 0.0.2');
	return data;
}

const MIGRATIONS: Array<{ from: string; to: string; run: (data: UserData) => UserData }> = [
	{ from: '0.0.0', to: '0.0.1', run: migrateFrom0 },
	{ from: '0.0.1', to: '0.0.2', run: migrateFrom001 }
];

// --- Public API ---

export function ensureMigrated(): void {
	if (typeof window === 'undefined') return;

	const currentVersion = localStorage.getItem(VERSION_KEY) ?? '0.0.0';
	if (currentVersion === CURRENT_VERSION) return;

	let data = currentVersion === '0.0.0' && !localStorage.getItem(KEY)
		? { ...DEFAULT_DATA, settings: { ...DEFAULT_SETTINGS } }
		: getLocalData();

	for (const migration of MIGRATIONS) {
		if (versionLessThan(currentVersion, migration.to) || currentVersion === migration.from) {
			data = migration.run(data);
		}
	}

	saveLocalData(data);
	localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
}

export function getLocalData(): UserData {
	const raw = localStorage.getItem(KEY);
	return raw ? JSON.parse(raw) : { ...DEFAULT_DATA };
}

export function saveLocalData(data: UserData): void {
	localStorage.setItem(KEY, JSON.stringify(data));
}
