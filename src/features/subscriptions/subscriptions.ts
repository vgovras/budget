import type { Subscription } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class SubscriptionsRepository {
	load(): Subscription[] {
		return Object.values(getLocalData().subscriptions).filter((s) => !s.deleted);
	}

	upsert(sub: Subscription): void {
		const data = getLocalData();
		data.subscriptions[sub.id] = sub;
		saveLocalData(data);
	}

	softDelete(id: string): void {
		const data = getLocalData();
		if (data.subscriptions[id]) {
			data.subscriptions[id] = { ...data.subscriptions[id], deleted: true, updatedAt: new Date().toISOString() };
			saveLocalData(data);
		}
	}
}
