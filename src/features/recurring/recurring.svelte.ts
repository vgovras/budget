import type { RecurringTransaction } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { nowISO } from '$lib/utils/format.js';
import { RecurringRepository } from './recurring.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

const SALARY_ID = 'rec-salary';

export class RecurringViewModel {
	#repo = new RecurringRepository();

	items = $state<RecurringTransaction[]>([]);

	readonly enabledItems = $derived(this.items.filter((r) => r.enabled));

	constructor() {
		if (typeof window !== 'undefined') {
			this.rehydrate();
			this.#processdue();
		}
	}

	rehydrate() {
		this.items = this.#repo.load();
	}

	add(data: Omit<RecurringTransaction, 'id' | 'updatedAt'>): void {
		const item: RecurringTransaction = { ...data, id: uuidv7(), updatedAt: new Date().toISOString() };
		this.items = [...this.items, item];
		this.#repo.upsert(item);
		markDirty();
	}

	update(id: string, patch: Partial<RecurringTransaction>): void {
		this.items = this.items.map((r) =>
			r.id === id ? { ...r, ...patch, updatedAt: new Date().toISOString() } : r
		);
		const updated = this.items.find((r) => r.id === id);
		if (updated) this.#repo.upsert(updated);
		markDirty();
	}

	remove(id: string): void {
		this.items = this.items.filter((r) => r.id !== id);
		this.#repo.softDelete(id);
		markDirty();
	}

	toggle(id: string): void {
		const item = this.items.find((r) => r.id === id);
		if (item) this.update(id, { enabled: !item.enabled });
	}

	syncSalary(salary: number, payday: number, accountId: string) {
		const existing = this.items.find((r) => r.id === SALARY_ID);

		if (salary <= 0) {
			if (existing) this.remove(SALARY_ID);
			return;
		}

		const nextDate = this.#computeNextPayday(payday);

		if (existing) {
			const dayChanged = existing.dayOfMonth !== payday;
			if (existing.amount === salary && existing.accountId === accountId && !dayChanged) return;
			this.update(SALARY_ID, {
				amount: salary,
				accountId,
				dayOfMonth: payday,
				...(dayChanged ? { nextDate: nextDate.toISOString() } : {})
			});
			return;
		}

		const item: RecurringTransaction = {
			id: SALARY_ID,
			icon: 'banknote',
			label: 'Salary',
			note: 'Salary',
			amount: salary,
			accountId,
			type: 'income',
			frequency: 'monthly',
			dayOfMonth: payday,
			nextDate: nextDate.toISOString(),
			enabled: true,
			updatedAt: new Date().toISOString()
		};
		this.items = [...this.items, item];
		this.#repo.upsert(item);
		markDirty();
	}

	#computeNextPayday(payday: number): Date {
		const now = new Date();
		const day = Math.min(payday, 28);
		const next = new Date(now.getFullYear(), now.getMonth(), day);
		if (next <= now) next.setMonth(next.getMonth() + 1);
		return next;
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
			for (const item of this.items) this.#repo.upsert(item);
			markDirty();
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
			case 'daily': date.setDate(date.getDate() + 1); break;
			case 'weekly': date.setDate(date.getDate() + 7); break;
			case 'monthly': date.setMonth(date.getMonth() + 1); break;
		}
	}
}

export const recurringVM = new RecurringViewModel();
