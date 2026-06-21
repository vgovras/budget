import type { Expense } from '$lib/types.js';
import { getDateKey, locale } from './format.js';
import { convert } from './currency.js';

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

/** Whole days from today (00:00) until the next payday. Always >= 1. */
export function daysUntilPayday(nextPayday: Date): number {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	const end = new Date(nextPayday);
	end.setHours(0, 0, 0, 0);
	return Math.max(1, Math.round((end.getTime() - now.getTime()) / MS_PER_DAY));
}

/** "Stupid" дайлі ліміт: available money spread evenly across the days left. */
export function dailyAllowance(available: number, daysLeft: number): number {
	return Math.floor(available / Math.max(1, daysLeft));
}

export interface UpcomingBill {
	amount: number;
	currency: string;
	nextDate?: string;
}

/** Sum of bills whose nextDate falls in [from, to), converted into `toCurrency`. */
export function sumBillsDueBefore(
	bills: UpcomingBill[],
	from: Date,
	to: Date,
	toCurrency: string
): number {
	return bills.reduce((sum, b) => {
		if (!b.nextDate) return sum;
		const due = new Date(b.nextDate);
		if (due < from || due >= to) return sum;
		return sum + convert(b.amount, b.currency, toCurrency);
	}, 0);
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

export function getTodaySpent(expenses: Expense[], accId: string): number {
	return expenses
		.filter(
			(e) =>
				e.accountId === accId && isSpending(e) && e.date && getDateKey(e.date) === 'today'
		)
		.reduce((s, e) => s + e.amount, 0);
}
