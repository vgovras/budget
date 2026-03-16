import type { Expense } from '$lib/types.js';

export class ExpensesRepository {
	readonly #key = 'budget:expenses';

	load(): { expenses: Expense[]; nextId: number } | null {
		try {
			const raw = localStorage.getItem(this.#key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	save(data: { expenses: Expense[]; nextId: number }): void {
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
