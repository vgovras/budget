import type { Expense } from '$lib/types.js';
import { ExpensesRepository } from './expenses.js';
import { syncToServer } from '$lib/utils/sync.js';

function expenseToTransaction(exp: Expense) {
	const isIncome = exp.type === 'income';
	return {
		accountId: exp.accountId,
		type: isIncome ? 'IN' : 'OUT',
		subtype: exp.type.toUpperCase(),
		amount: exp.amount,
		icon: exp.icon,
		label: exp.label,
		note: exp.note,
		createdAt: exp.date || new Date().toISOString(),
		meta: {
			localId: exp.id,
			commission: exp.commission,
			netAmount: exp.netAmount,
			toAccountId: exp.toAccountId,
			exchangeRate: exp.exchangeRate,
			displayAmount: exp.displayAmount,
			displayCurrency: exp.displayCurrency
		}
	};
}

export class ExpensesViewModel {
	#repo: ExpensesRepository;

	expenses = $state<Expense[]>([]);
	nextId = $state(1);

	readonly total = $derived(
		this.expenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0)
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
		syncToServer('/api/transactions', 'POST', expenseToTransaction(exp));
		return exp;
	}

	update(id: number, patch: Partial<Expense>) {
		this.expenses = this.expenses.map((e) => (e.id === id ? { ...e, ...patch } : e));
		this.#save();
		// Transactions are append-only on server — update creates adjustment
		const updated = this.expenses.find((e) => e.id === id);
		if (updated) syncToServer('/api/transactions', 'POST', expenseToTransaction(updated));
	}

	remove(id: number) {
		const removed = this.expenses.find((e) => e.id === id);
		this.expenses = this.expenses.filter((e) => e.id !== id);
		this.#save();
		// Append-only: create reversal transaction
		if (removed) {
			const reversal = {
				...expenseToTransaction(removed),
				type: removed.type === 'income' ? 'OUT' : 'IN',
				subtype: 'ADJUSTMENT',
				meta: { ...expenseToTransaction(removed).meta, reversedLocalId: removed.id }
			};
			syncToServer('/api/transactions', 'POST', reversal);
		}
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
