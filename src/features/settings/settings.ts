import type { Settings } from '$lib/types.js';

export class SettingsRepository {
	readonly #key = 'budget:settings';

	load(): Settings | null {
		try {
			const raw = localStorage.getItem(this.#key);
			return raw ? JSON.parse(raw) : null;
		} catch {
			return null;
		}
	}

	save(data: Settings): void {
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
