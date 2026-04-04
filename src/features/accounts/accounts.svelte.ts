import type { Account } from '$lib/types.js';
import { AccountsRepository } from './accounts.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';
import { authClient } from '$lib/auth-client';

export class AccountsViewModel {
	#repo = new AccountsRepository();

	accounts = $state<Account[]>([]);
	activeIdx = $state(0);

	readonly active = $derived(this.accounts[this.activeIdx]);
	readonly primary = $derived(this.accounts.find((a) => a.isPrimary) ?? this.accounts[0]);

	constructor() {
		this.accounts = this.#repo.load();
	}

	setActive(idx: number) {
		this.activeIdx = idx;
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
		if (this.activeIdx >= this.accounts.length) {
			this.activeIdx = Math.max(0, this.accounts.length - 1);
		}
		this.#repo.softDelete(id);
		markDirty();
	}

	async resetAll() {
		for (const a of this.accounts) this.#repo.softDelete(a.id);
		this.accounts = [];
		this.activeIdx = 0;
	
		await authClient.signOut()
		await authClient.revokeSessions();
	
		markDirty();
	}
}

export const accountsVM = new AccountsViewModel();
