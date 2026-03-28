import type { UserData } from '$lib/types.js';

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

export function mergeUserData(server: UserData, client: UserData): UserData {
	return {
		expenses: mergeById(server.expenses, client.expenses),
		accounts: mergeById(server.accounts, client.accounts),
		categories: mergeById(server.categories, client.categories),
		subscriptions: mergeById(server.subscriptions, client.subscriptions),
		recurring: mergeById(server.recurring, client.recurring),
		settings: client.settings ?? server.settings,
		syncedAt: new Date().toISOString()
	};
}
