import type { RecurringTransaction } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { nowISO } from '$lib/utils/format.js';
import { RecurringRepository } from './recurring.js';

const SALARY_ID = 'rec-salary';

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

	syncSalary(salary: number, payday: number, accountId: string) {
		const existing = this.items.find((r) => r.id === SALARY_ID);

		if (salary <= 0) {
			if (existing) this.remove(SALARY_ID);
			return;
		}

		if (existing) {
			if (existing.amount === salary && existing.accountId === accountId) return;
			this.update(SALARY_ID, { amount: salary, accountId });
			return;
		}

		const now = new Date();
		const day = Math.min(payday, 28);
		let nextDate = new Date(now.getFullYear(), now.getMonth(), day);
		if (nextDate <= now) nextDate.setMonth(nextDate.getMonth() + 1);

		const item: RecurringTransaction = {
			id: SALARY_ID,
			icon: 'banknote',
			label: 'Salary',
			note: 'Salary',
			amount: salary,
			accountId,
			type: 'income',
			frequency: 'monthly',
			nextDate: nextDate.toISOString(),
			enabled: true
		};
		this.items = [...this.items, item];
		this.#repo.save(this.items);
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
