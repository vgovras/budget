import type { Category, CategoryType } from '$lib/types.js';
import { CategoriesRepository } from './categories.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

export class CategoriesViewModel {
	#repo = new CategoriesRepository();

	categories = $state<Category[]>([]);

	readonly expenseCategories = $derived(this.categories.filter((c) => c.type === 'expense'));
	readonly incomeCategories = $derived(this.categories.filter((c) => c.type === 'income'));

	constructor() {
		if (typeof window !== 'undefined') {
			this.rehydrate();
		}
	}

	rehydrate() {
		this.categories = this.#repo.load();
	}

	byType(type: CategoryType) { return this.categories.filter((c) => c.type === type); }
	getById(id: string) { return this.categories.find((c) => c.id === id); }
	getByIcon(icon: string) { return this.categories.find((c) => c.icon === icon); }

	add(data: Omit<Category, 'id' | 'updatedAt'>): Category {
		const cat: Category = { ...data, id: uuidv7(), updatedAt: new Date().toISOString() };
		this.categories = [...this.categories, cat];
		this.#repo.upsert(cat);
		markDirty();
		return cat;
	}

	update(id: string, patch: Partial<Category>): void {
		this.categories = this.categories.map((c) =>
			c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c
		);
		const updated = this.categories.find((c) => c.id === id);
		if (updated) this.#repo.upsert(updated);
		markDirty();
	}

	remove(id: string): void {
		this.categories = this.categories.filter((c) => c.id !== id);
		this.#repo.softDelete(id);
		markDirty();
	}
}

export const categoriesVM = new CategoriesViewModel();
