import type { Expense } from '$lib/types.js';
import { ExpensesRepository } from './expenses.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

export class ExpensesViewModel {
	#repo = new ExpensesRepository();

	expenses = $state<Expense[]>([]);

	readonly total = $derived(
		this.expenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
	);

	constructor() {
		this.expenses = this.#repo.load();
	}

	add(data: Omit<Expense, 'id' | 'updatedAt'>) {
		const exp: Expense = { ...data, id: uuidv7(), updatedAt: new Date().toISOString() };
		this.expenses = [exp, ...this.expenses];
		this.#repo.upsert(exp);
		markDirty();
		return exp;
	}

	update(id: string, patch: Partial<Expense>) {
		this.expenses = this.expenses.map((e) =>
			e.id === id ? { ...e, ...patch, updatedAt: new Date().toISOString() } : e
		);
		const updated = this.expenses.find((e) => e.id === id);
		if (updated) this.#repo.upsert(updated);
		markDirty();
	}

	remove(id: string) {
		this.expenses = this.expenses.filter((e) => e.id !== id);
		this.#repo.softDelete(id);
		markDirty();
	}

	forAccount(accountId: string): Expense[] {
		return this.expenses.filter((e) => e.accountId === accountId);
	}

	resetAll() {
		for (const e of this.expenses) this.#repo.softDelete(e.id);
		this.expenses = [];
		markDirty();
	}
}

export const expensesVM = new ExpensesViewModel();
