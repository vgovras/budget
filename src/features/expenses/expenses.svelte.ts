import type { Expense } from '$lib/types.js';
import { ExpensesRepository } from './expenses.js';

export class ExpensesViewModel {
	#repo: ExpensesRepository;

	expenses = $state<Expense[]>([]);
	nextId = $state(1);

	readonly total = $derived(
		this.expenses.filter((e) => e.type !== 'income').reduce((s, e) => s + e.amount, 0)
	);

	constructor(repo: ExpensesRepository) {
		this.#repo = repo;
		const saved = this.#repo.load();
		if (saved) {
			this.expenses = saved.expenses;
			this.nextId = saved.nextId;
		}
	}

	add(data: Omit<Expense, 'id'>) {
		const exp = { ...data, id: this.nextId++ };
		this.expenses = [exp, ...this.expenses];
		this.#save();
		return exp;
	}

	update(id: number, patch: Partial<Expense>) {
		this.expenses = this.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
		this.#save();
	}

	remove(id: number) {
		this.expenses = this.expenses.filter((e) => e.id !== id);
		this.#save();
	}

	forAccount(accountId: string): Expense[] {
		return this.expenses.filter((e) => e.accountId === accountId);
	}

	resetAll() {
		this.expenses = [];
		this.nextId = 1;
		this.#repo.clear();
	}

	#save() {
		this.#repo.save({ expenses: this.expenses, nextId: this.nextId });
	}
}

export const expensesVM = new ExpensesViewModel(new ExpensesRepository());
