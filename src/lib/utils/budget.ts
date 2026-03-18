import type { Expense, Account } from '$lib/types.js';
import { getDateKey } from './format.js';

export function getAccStats(expenses: Expense[], accId: string): number {
	let spent = 0;
	for (const e of expenses) {
		if (e.accountId === accId && e.type !== 'income') spent += e.amount;
	}
	return spent;
}

export function getDailyBudget(expenses: Expense[], account: Account, budgetOverride?: number): number {
	if (!account) return 0;
	const budget = budgetOverride ?? account.budget;
	const now = new Date();
	const daysLeft = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
	const totalSpent = expenses
		.filter((e) => e.accountId === account.id && e.type !== 'income')
		.reduce((s, e) => s + e.amount, 0);
	const remaining = Math.max(0, budget - totalSpent);
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

/**
 * Checks if salary should be credited based on payday and last credit date.
 * Returns shouldCredit=true if current date >= this month's payday
 * and the last credit was before this month's payday.
 */
export function checkPayday(
	payday: number,
	lastPayday: string
): { shouldCredit: boolean; newPaydayDate: string } {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	// Clamp payday to actual days in current month
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const clampedPayday = Math.min(payday, daysInMonth);

	const paydayThisMonth = new Date(year, month, clampedPayday);
	paydayThisMonth.setHours(0, 0, 0, 0);

	const today = new Date(year, month, now.getDate());
	today.setHours(0, 0, 0, 0);

	if (today < paydayThisMonth) {
		return { shouldCredit: false, newPaydayDate: '' };
	}

	// Check if already credited for this payday
	if (lastPayday) {
		const lastDate = new Date(lastPayday);
		lastDate.setHours(0, 0, 0, 0);
		if (lastDate >= paydayThisMonth) {
			return { shouldCredit: false, newPaydayDate: '' };
		}
	}

	return { shouldCredit: true, newPaydayDate: paydayThisMonth.toISOString() };
}

export function getTodaySpent(expenses: Expense[], accId: string): number {
	return expenses
		.filter(
			(e) =>
				e.accountId === accId && e.type !== 'income' && e.date && getDateKey(e.date) === 'today'
		)
		.reduce((s, e) => s + e.amount, 0);
}
