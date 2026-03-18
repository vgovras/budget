import type { RecurringTransaction } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { nowISO } from '$lib/utils/format.js';
import { RecurringRepository } from './recurring.js';

export class RecurringViewModel {
	#repo: RecurringRepository;

	items = $state<RecurringTransaction[]>([]);

	readonly enabledItems = $derived(this.items.filter((r) => r.enabled));

	constructor(repo: RecurringRepository) {
		this.#repo = repo;
		if (typeof window !== 'undefined') {
			this.items = this.#repo.load() ?? [];
			this.#processdue();
		}
	}

	add(data: Omit<RecurringTransaction, 'id'>): void {
		const item: RecurringTransaction = { ...data, id: 'rec-' + Date.now() };
		this.items = [...this.items, item];
		this.#repo.save(this.items);
	}

	update(id: string, patch: Partial<RecurringTransaction>): void {
		this.items = this.items.map((r) => (r.id === id ? { ...r, ...patch } : r));
		this.#repo.save(this.items);
	}

	remove(id: string): void {
		this.items = this.items.filter((r) => r.id !== id);
		this.#repo.save(this.items);
	}

	toggle(id: string): void {
		const item = this.items.find((r) => r.id === id);
		if (item) {
			this.update(id, { enabled: !item.enabled });
		}
	}

	resetAll(): void {
		this.items = [];
		this.#repo.clear();
	}

	#processdue(): void {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		let changed = false;

		for (const item of this.items) {
			if (!item.enabled) continue;
			const nextDate = new Date(item.nextDate);
			nextDate.setHours(0, 0, 0, 0);

			while (nextDate <= now) {
				this.#createExpense(item);
				this.#advanceDate(item, nextDate);
				changed = true;
			}

			item.nextDate = nextDate.toISOString();
		}

		if (changed) {
			this.items = [...this.items];
			this.#repo.save(this.items);
		}
	}

	#createExpense(item: RecurringTransaction): void {
		const acc = accountsVM.accounts.find((a) => a.id === item.accountId);
		if (!acc) return;

		if (item.type === 'income') {
			accountsVM.update(acc.id, { balance: acc.balance + item.amount });
		} else {
			accountsVM.update(acc.id, { balance: acc.balance - item.amount });
		}

		expensesVM.add({
			icon: item.icon,
			label: item.label,
			note: item.note,
			amount: item.amount,
			day: 'today',
			date: nowISO(),
			accountId: item.accountId,
			type: item.type
		});
	}

	#advanceDate(item: RecurringTransaction, date: Date): void {
		switch (item.frequency) {
			case 'daily':
				date.setDate(date.getDate() + 1);
				break;
			case 'weekly':
				date.setDate(date.getDate() + 7);
				break;
			case 'monthly':
				date.setMonth(date.getMonth() + 1);
				break;
		}
	}
}

export const recurringVM = new RecurringViewModel(new RecurringRepository());
