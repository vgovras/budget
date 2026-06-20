import type { UserData, Settings } from '$lib/types.js';
import { DEFAULT_SETTINGS } from '$lib/constants.js';

function mergeById<T extends { updatedAt: string }>(
	server: Record<string, T> = {},
	client: Record<string, T> = {}
): Record<string, T> {
	const merged = { ...server };
	for (const [id, item] of Object.entries(client)) {
		if (!merged[id] || item.updatedAt > merged[id].updatedAt) {
			merged[id] = item;
		}
	}
	return merged;
}

function mergeSettings(server: Settings | undefined, client: Settings | undefined): Settings {
	const s = server ?? DEFAULT_SETTINGS;
	const c = client ?? DEFAULT_SETTINGS;

	// Last-write-wins on the whole settings object by updatedAt (client wins ties).
	const winner = (c.updatedAt ?? '') >= (s.updatedAt ?? '') ? c : s;

	return {
		...winner,
		// not-null wins — never overwrite a completed onboarding with null
		onboardingCompletedAt: c.onboardingCompletedAt ?? s.onboardingCompletedAt ?? null
	};
}

export function mergeUserData(server: UserData, client: UserData): UserData {
	return {
		expenses: mergeById(server.expenses, client.expenses),
		accounts: mergeById(server.accounts, client.accounts),
		categories: mergeById(server.categories, client.categories),
		subscriptions: mergeById(server.subscriptions, client.subscriptions),
		recurring: mergeById(server.recurring, client.recurring),
		settings: mergeSettings(server.settings, client.settings),
		syncedAt: new Date().toISOString()
	};
}
