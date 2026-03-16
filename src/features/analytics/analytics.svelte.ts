import type { Expense } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { CATEGORIES } from '$lib/constants.js';
import { getDailyBudget } from '$lib/utils/budget.js';

export class AnalyticsViewModel {
	readonly accountExpenses = $derived(
		expensesVM.expenses.filter(
			(e: Expense) => e.accountId === accountsVM.active?.id && e.type !== 'income'
		)
	);

	readonly total = $derived(
		this.accountExpenses.reduce((s: number, e: Expense) => s + e.amount, 0)
	);

	readonly byCategory = $derived(
		Object.entries(
			this.accountExpenses.reduce<Record<string, number>>((acc, e: Expense) => {
				acc[e.icon] = (acc[e.icon] ?? 0) + e.amount;
				return acc;
			}, {})
		)
			.map(([icon, sum]: [string, number]) => {
				const cat = CATEGORIES.find((c) => c.icon === icon);
				return { icon, label: cat?.label ?? icon, sum };
			})
			.sort((a, b) => b.sum - a.sum)
	);

	readonly weeklyAmounts = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - (6 - i));
			const key = d.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
			return this.accountExpenses
				.filter(
					(e: Expense) =>
						e.date &&
						new Date(e.date).toLocaleDateString('uk-UA', {
							day: '2-digit',
							month: '2-digit'
						}) === key
				)
				.reduce((s: number, e: Expense) => s + e.amount, 0);
		})
	);

	readonly dailyBudget = $derived(
		accountsVM.active ? getDailyBudget(expensesVM.expenses, accountsVM.active) : 0
	);

	readonly isEmpty = $derived(this.accountExpenses.length === 0);
}
