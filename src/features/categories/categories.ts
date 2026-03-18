import type { Category } from '$lib/types.js';

export class CategoriesRepository {
	readonly #key = 'budget:categories';

	load(): Category[] | null {
		try {
			const raw = localStorage.getItem(this.#key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	save(data: Category[]): void {
		try {
			localStorage.setItem(this.#key, JSON.stringify(data));
		} catch {
			/* quota exceeded */
		}
	}

	clear(): void {
		localStorage.removeItem(this.#key);
	}
}
