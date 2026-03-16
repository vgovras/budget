import type { Expense, Account } from '$lib/types.js';
import { getDateKey } from './format.js';

export function getAccStats(expenses: Expense[], accId: string): number {
	let spent = 0;
	for (const e of expenses) {
		if (e.accountId === accId && e.type !== 'income') spent += e.amount;
	}
	return spent;
}

export function getDailyBudget(expenses: Expense[], account: Account): number {
	if (!account) return 0;
	const now = new Date();
	const daysLeft =
		new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
	const totalSpent = expenses
		.filter((e) => e.accountId === account.id && e.type !== 'income')
		.reduce((s, e) => s + e.amount, 0);
	const remaining = Math.max(0, account.budget - totalSpent);
	return Math.floor(remaining / Math.max(daysLeft, 1));
}

export function getTodaySpent(expenses: Expense[], accId: string): number {
	return expenses
		.filter(
			(e) =>
				e.accountId === accId &&
				e.type !== 'income' &&
				e.date &&
				getDateKey(e.date) === 'today'
		)
		.reduce((s, e) => s + e.amount, 0);
}
