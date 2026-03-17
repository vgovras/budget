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
	const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
	const totalSpent = expenses
		.filter((e) => e.accountId === account.id && e.type !== 'income')
		.reduce((s, e) => s + e.amount, 0);
	const remaining = Math.max(0, account.budget - totalSpent);
	return Math.floor(remaining / Math.max(daysLeft, 1));
}

export function getWeeklyAmounts(expenses: Expense[]): number[] {
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - (6 - i));
		const key = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
		return expenses
			.filter(
				(e) =>
					e.date &&
					new Date(e.date).toLocaleDateString('uk-UA', {
						day: '2-digit',
						month: '2-digit'
					}) === key
			)
			.reduce((s, e) => s + e.amount, 0);
	});
}

export function getWeekDayLabels(): string[] {
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - (6 - i));
		return d.toLocaleDateString('uk-UA', { weekday: 'short' }).slice(0, 2);
	});
}

export function prorateForCurrentMonth(budget: number): {
	proratedBudget: number;
	daysLeft: number;
} {
	const now = new Date();
	const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
	const daysLeft = daysInMonth - now.getDate() + 1;
	return {
		proratedBudget: Math.round(budget * (daysLeft / daysInMonth)),
		daysLeft
	};
}

export function getTodaySpent(expenses: Expense[], accId: string): number {
	return expenses
		.filter(
			(e) =>
				e.accountId === accId && e.type !== 'income' && e.date && getDateKey(e.date) === 'today'
		)
		.reduce((s, e) => s + e.amount, 0);
}
