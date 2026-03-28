import type { RecurringTransaction } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class RecurringRepository {
	load(): RecurringTransaction[] {
		return Object.values(getLocalData().recurring).filter((r) => !r.deleted);
	}

	upsert(item: RecurringTransaction): void {
		const data = getLocalData();
		data.recurring[item.id] = item;
		saveLocalData(data);
	}

	softDelete(id: string): void {
		const data = getLocalData();
		if (data.recurring[id]) {
			data.recurring[id] = { ...data.recurring[id], deleted: true, updatedAt: new Date().toISOString() };
			saveLocalData(data);
		}
	}
}
