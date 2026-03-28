import type { Category } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class CategoriesRepository {
	load(): Category[] {
		return Object.values(getLocalData().categories).filter((c) => !c.deleted);
	}

	upsert(cat: Category): void {
		const data = getLocalData();
		data.categories[cat.id] = cat;
		saveLocalData(data);
	}

	saveAll(categories: Category[]): void {
		const data = getLocalData();
		const now = new Date().toISOString();
		for (const c of categories) {
			data.categories[c.id] = { ...c, updatedAt: c.updatedAt ?? now };
		}
		saveLocalData(data);
	}

	softDelete(id: string): void {
		const data = getLocalData();
		if (data.categories[id]) {
			data.categories[id] = { ...data.categories[id], deleted: true, updatedAt: new Date().toISOString() };
			saveLocalData(data);
		}
	}
}
