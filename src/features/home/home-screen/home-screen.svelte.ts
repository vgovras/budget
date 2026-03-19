import type { Expense } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { getTodaySpent, getWeeklyAmounts } from '$lib/utils/budget.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { groupByDate, locale } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export class HomeScreenViewModel {
	activePeriod = $state<'week' | 'month' | 'year'>('month');

	readonly greeting = $derived.by(() => {
		const hour = new Date().getHours();
		if (hour < 12) return m.home_greeting_morning();
		if (hour < 18) return m.home_greeting_afternoon();
		return m.home_greeting_evening();
	});

	readonly nativeCurrency = $derived(accountsVM.active?.currency ?? settingsVM.currency);
	readonly currency = $derived(
		settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : this.nativeCurrency
	);

	#toDisplay(amount: number) {
		return settingsVM.toDisplay(amount, this.nativeCurrency);
	}

	readonly accountExpenses = $derived(
		expensesVM.expenses.filter(
			(e: Expense) => e.accountId === accountsVM.active?.id && e.type === 'expense'
		)
	);

	readonly #rawSpentAmount = $derived(
		this.accountExpenses.reduce((s: number, e: Expense) => s + e.amount, 0)
	);

	readonly spentAmount = $derived(this.#toDisplay(this.#rawSpentAmount));

	readonly totalBudget = $derived(accountsVM.active?.budget ?? settingsVM.budget);

	readonly accountBalance = $derived(this.#toDisplay(accountsVM.active?.balance ?? 0));

	readonly remainingBudget = $derived(
		this.#toDisplay(Math.max(0, this.totalBudget - this.#rawSpentAmount))
	);

	readonly spentPercent = $derived(
		this.totalBudget > 0 ? Math.round((this.#rawSpentAmount / this.totalBudget) * 100) : 0
	);

	readonly changePercent = $derived(
		this.totalBudget > 0
			? `–${((this.#rawSpentAmount / this.totalBudget) * 100).toFixed(1)}%`
			: '0%'
	);

	readonly monthLabel = $derived(
		new Date().toLocaleDateString(locale(), { month: 'long', year: 'numeric' })
	);

	readonly #nextPayday = $derived.by(() => {
		const salary = recurringVM.items.find((r) => r.id === 'rec-salary');
		if (salary?.nextDate) return new Date(salary.nextDate);
		const now = new Date();
		return new Date(now.getFullYear(), now.getMonth() + 1, 0);
	});

	readonly daysUntilEnd = $derived.by(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const diff = this.#nextPayday.getTime() - now.getTime();
		return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
	});

	readonly daysEndDate = $derived.by(() => {
		const d = this.#nextPayday;
		return d.toLocaleDateString(locale(), { day: 'numeric', month: 'long' });
	});

	readonly dailyBudget = $derived(
		Math.floor(this.remainingBudget / Math.max(this.daysUntilEnd, 1))
	);

	readonly todaySpent = $derived(
		accountsVM.active ? this.#toDisplay(getTodaySpent(expensesVM.expenses, accountsVM.active.id)) : 0
	);

	readonly dailyRemaining = $derived(Math.max(0, this.dailyBudget - this.todaySpent));

	readonly monthlyRemaining = $derived(this.remainingBudget);

	readonly hasExpenses = $derived(this.accountExpenses.length > 0);

	readonly isNewMonth = $derived(this.spentAmount === 0);

	readonly byCategory = $derived(
		Object.entries(
			this.accountExpenses.reduce<Record<string, number>>((acc, e: Expense) => {
				acc[e.icon] = (acc[e.icon] ?? 0) + e.amount;
				return acc;
			}, {})
		)
			.map(([icon, sum]: [string, number]) => {
				const cat = categoriesVM.categories.find((c) => c.icon === icon);
				return { icon, label: cat?.label ?? icon, sum: this.#toDisplay(sum) };
			})
			.sort((a, b) => b.sum - a.sum)
	);

	readonly weeklyAmounts = $derived(
		getWeeklyAmounts(this.accountExpenses).map((v) => this.#toDisplay(v))
	);

	readonly recentExpenses = $derived.by(() => {
		const limited = this.accountExpenses.slice(0, 5);
		return groupByDate(limited);
	});

	setPeriod(p: 'week' | 'month' | 'year') {
		this.activePeriod = p;
	}
}
