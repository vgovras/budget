import type { Account } from '$lib/types.js';

export class AccountsRepository {
	readonly #key = 'budget:accounts';

	load(): Account[] | null {
		try {
			const raw = localStorage.getItem(this.#key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	save(data: Account[]): void {
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
