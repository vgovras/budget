import type { Expense, Account } from '$lib/types.js';
import { getDateKey, locale } from './format.js';

const MS_PER_DAY = 86_400_000;

export function isSpending(e: Expense): boolean {
	return e.type === 'expense';
}

export function getAccStats(expenses: Expense[], accId: string): number {
	let spent = 0;
	for (const e of expenses) {
		if (e.accountId === accId && isSpending(e)) spent += e.amount;
	}
	return spent;
}

/** Effective start = max(periodStart, min(accountCreated, earliestExpense)) */
export function getEffectiveStart(
	periodStart: Date,
	accountCreatedAt?: string,
	earliestExpenseDate?: string
): Date {
	let earliest = accountCreatedAt ? new Date(accountCreatedAt) : periodStart;
	if (earliestExpenseDate) {
		const expDate = new Date(earliestExpenseDate);
		if (expDate < earliest) earliest = expDate;
	}
	earliest.setHours(0, 0, 0, 0);
	return earliest > periodStart ? earliest : periodStart;
}

/** Prorate budget if effectiveStart is after periodStart. */
export function getEffectiveBudget(
	totalBudget: number,
	periodStart: Date,
	periodEnd: Date,
	effectiveStart: Date
): number {
	if (effectiveStart <= periodStart) return totalBudget;
	const totalDays = Math.max(1, Math.round((periodEnd.getTime() - periodStart.getTime()) / MS_PER_DAY));
	const activeDays = Math.max(1, Math.round((periodEnd.getTime() - effectiveStart.getTime()) / MS_PER_DAY));
	return Math.round(totalBudget * activeDays / totalDays);
}

/** Daily remaining with rollover. Can be negative. */
export function calcDailyRemaining(
	effectiveBudget: number,
	totalSpent: number,
	effectiveStart: Date,
	periodEnd: Date
): number {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const totalDays = Math.max(1, Math.round((periodEnd.getTime() - effectiveStart.getTime()) / MS_PER_DAY));
	const daysPassed = Math.max(1, Math.floor((now.getTime() - effectiveStart.getTime()) / MS_PER_DAY) + 1);
	return Math.floor((effectiveBudget / totalDays) * daysPassed - totalSpent);
}

export function getWeeklyAmounts(expenses: Expense[]): number[] {
	return Array.from({ length: 7 }, (_, i) => {
		const d = new Date();
		d.setDate(d.getDate() - (6 - i));
		const key = d.toLocaleDateString(locale(), { day: '2-digit', month: '2-digit' });
		return expenses
			.filter(
				(e) =>
					e.date &&
					new Date(e.date).toLocaleDateString(locale(), {
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
		return d.toLocaleDateString(locale(), { weekday: 'short' }).slice(0, 2);
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

export function checkPayday(
	payday: number,
	lastPayday: string
): { shouldCredit: boolean; newPaydayDate: string } {
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const clampedPayday = Math.min(payday, daysInMonth);

	const paydayThisMonth = new Date(year, month, clampedPayday);
	paydayThisMonth.setHours(0, 0, 0, 0);

	const today = new Date(year, month, now.getDate());
	today.setHours(0, 0, 0, 0);

	if (today < paydayThisMonth) {
		return { shouldCredit: false, newPaydayDate: '' };
	}

	if (lastPayday) {
		const lastDate = new Date(lastPayday);
		lastDate.setHours(0, 0, 0, 0);
		if (lastDate >= paydayThisMonth) {
			return { shouldCredit: false, newPaydayDate: '' };
		}
	}

	return { shouldCredit: true, newPaydayDate: paydayThisMonth.toISOString() };
}

export function getPeriodStart(nextPayday: Date, payday: number): Date {
	const start = new Date(nextPayday);
	start.setHours(0, 0, 0, 0);
	start.setMonth(start.getMonth() - 1);
	const daysInMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
	start.setDate(Math.min(payday, daysInMonth));
	return start;
}

export function getTodaySpent(expenses: Expense[], accId: string): number {
	return expenses
		.filter(
			(e) =>
				e.accountId === accId && isSpending(e) && e.date && getDateKey(e.date) === 'today'
		)
		.reduce((s, e) => s + e.amount, 0);
}
