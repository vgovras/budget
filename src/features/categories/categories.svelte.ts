import type { Category, CategoryType } from '$lib/types.js';
import { DEFAULT_CATEGORIES } from '$lib/constants.js';
import { CategoriesRepository } from './categories.js';
import { syncToServer } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

export class CategoriesViewModel {
	#repo: CategoriesRepository;

	categories = $state<Category[]>([]);

	readonly expenseCategories = $derived(
		this.categories.filter((c) => c.type === 'expense')
	);

	readonly incomeCategories = $derived(
		this.categories.filter((c) => c.type === 'income')
	);

	constructor(repo: CategoriesRepository) {
		this.#repo = repo;
		if (typeof window !== 'undefined') {
			this.#hydrate();
		}
	}

	#hydrate() {
		const saved = this.#repo.load();
		if (saved) {
			this.categories = saved.map((c) => ({ ...c, type: c.type ?? 'expense' as CategoryType }));
		} else {
			this.categories = [...DEFAULT_CATEGORIES];
		}
	}

	byType(type: CategoryType): Category[] {
		return this.categories.filter((c) => c.type === type);
	}

	getById(id: string): Category | undefined {
		return this.categories.find((c) => c.id === id);
	}

	getByIcon(icon: string): Category | undefined {
		return this.categories.find((c) => c.icon === icon);
	}

	add(data: Omit<Category, 'id'>): Category {
		const cat: Category = { ...data, id: uuidv7() };
		this.categories = [...this.categories, cat];
		this.#save();
		return cat;
	}

	update(id: string, patch: Partial<Category>): void {
		this.categories = this.categories.map((c) => (c.id === id ? { ...c, ...patch } : c));
		this.#save();
	}

	remove(id: string): void {
		this.categories = this.categories.filter((c) => c.id !== id);
		this.#save();
	}

	resetAll(): void {
		this.categories = [...DEFAULT_CATEGORIES];
		this.#repo.clear();
		syncToServer('/api/user', 'PATCH', { categories: this.categories });
	}

	#save(): void {
		this.#repo.save(this.categories);
		syncToServer('/api/user', 'PATCH', { categories: this.categories });
	}
}

export const categoriesVM = new CategoriesViewModel(new CategoriesRepository());
