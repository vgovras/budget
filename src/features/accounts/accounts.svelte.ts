import type { Account } from '$lib/types.js';
import { AccountsRepository } from './accounts.js';
import { syncToServer } from '$lib/utils/sync.js';

export class AccountsViewModel {
	#repo: AccountsRepository;

	accounts = $state<Account[]>([]);
	activeIdx = $state(0);

	readonly active = $derived(this.accounts[this.activeIdx]);
	readonly primary = $derived(this.accounts.find((a) => a.isPrimary) ?? this.accounts[0]);

	constructor(repo: AccountsRepository) {
		this.#repo = repo;
		const saved = this.#repo.load();
		if (saved) {
			this.accounts = saved;
		}
	}

	setActive(idx: number) {
		this.activeIdx = idx;
	}

	add(data: Omit<Account, 'id'>) {
		const acc = { ...data, id: 'acc-' + Date.now(), createdAt: new Date().toISOString() };
		this.accounts = [...this.accounts, acc];
		this.#repo.save(this.accounts);
		syncToServer('/api/accounts', 'POST', acc);
	}

	update(id: string, patch: Partial<Account>) {
		this.accounts = this.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a));
		this.#repo.save(this.accounts);
		syncToServer(`/api/accounts/${id}`, 'PATCH', patch);
	}

	setPrimary(id: string) {
		this.accounts = this.accounts.map((a) => ({ ...a, isPrimary: a.id === id }));
		this.#repo.save(this.accounts);
		for (const acc of this.accounts) {
			syncToServer(`/api/accounts/${acc.id}`, 'PATCH', { isPrimary: acc.id === id });
		}
	}

	remove(id: string) {
		this.accounts = this.accounts.filter((a) => a.id !== id);
		if (this.activeIdx >= this.accounts.length) {
			this.activeIdx = Math.max(0, this.accounts.length - 1);
		}
		this.#repo.save(this.accounts);
		syncToServer(`/api/accounts/${id}`, 'DELETE');
	}

	resetAll() {
		for (const acc of this.accounts) {
			syncToServer(`/api/accounts/${acc.id}`, 'DELETE');
		}
		this.accounts = [];
		this.activeIdx = 0;
		this.#repo.clear();
	}
}

export const accountsVM = new AccountsViewModel(new AccountsRepository());
