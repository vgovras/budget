import type { Account } from '$lib/types.js';
import { AccountsRepository } from './accounts.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

export class AccountsViewModel {
	#repo = new AccountsRepository();

	accounts = $state<Account[]>([]);
	/** null → fall back to the primary account; set by an explicit user selection. */
	#selectedIdx = $state<number | null>(null);

	readonly primary = $derived(this.accounts.find((a) => a.isPrimary) ?? this.accounts[0]);

	readonly activeIdx = $derived.by(() => {
		if (this.#selectedIdx !== null && this.#selectedIdx < this.accounts.length) {
			return this.#selectedIdx;
		}
		const idx = this.accounts.findIndex((a) => a.isPrimary);
		return idx >= 0 ? idx : 0;
	});

	readonly active = $derived(this.accounts[this.activeIdx]);

	constructor() {
		this.rehydrate();
	}

	rehydrate() {
		this.accounts = this.#repo.load();
	}

	setActive(idx: number) {
		this.#selectedIdx = idx;
	}

	add(data: Omit<Account, 'id' | 'updatedAt'>) {
		const now = new Date().toISOString();
		const acc: Account = { ...data, id: uuidv7(), updatedAt: now, createdAt: now };
		this.accounts = [...this.accounts, acc];
		this.#repo.upsert(acc);
		markDirty();
	}

	update(id: string, patch: Partial<Account>) {
		this.accounts = this.accounts.map((a) =>
			a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
		);
		const updated = this.accounts.find((a) => a.id === id);
		if (updated) this.#repo.upsert(updated);
		markDirty();
	}

	setPrimary(id: string) {
		this.accounts = this.accounts.map((a) => ({
			...a,
			isPrimary: a.id === id,
			updatedAt: new Date().toISOString()
		}));
		for (const acc of this.accounts) this.#repo.upsert(acc);
		markDirty();
	}

	remove(id: string) {
		this.accounts = this.accounts.filter((a) => a.id !== id);
		if (this.#selectedIdx !== null && this.#selectedIdx >= this.accounts.length) {
			this.#selectedIdx = null;
		}
		this.#repo.softDelete(id);
		markDirty();
	}

}

export const accountsVM = new AccountsViewModel();
