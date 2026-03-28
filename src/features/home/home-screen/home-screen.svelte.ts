import type { Expense } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { getTodaySpent, getWeeklyAmounts, getPeriodStart } from '$lib/utils/budget.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { getRecentUnique } from '$features/add-expense/quick-chips/quick-chips.js';
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

	readonly nativeCurrency = $derived(accountsVM.active?.currencyCode ?? settingsVM.currency);
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

	readonly #effectiveBudget = $derived.by(() => {
		const created = accountsVM.active?.createdAt;
		if (!created) return this.totalBudget;
		const createdDate = new Date(created);
		createdDate.setHours(0, 0, 0, 0);
		const periodStart = getPeriodStart(this.#nextPayday, settingsVM.payday);
		if (createdDate <= periodStart) return this.totalBudget;
		const msPerDay = 1000 * 60 * 60 * 24;
		const totalDays = Math.max(1, Math.round((this.#nextPayday.getTime() - periodStart.getTime()) / msPerDay));
		const daysFromCreation = Math.max(1, Math.round((this.#nextPayday.getTime() - createdDate.getTime()) / msPerDay));
		return Math.round(this.totalBudget * daysFromCreation / totalDays);
	});

	readonly remainingBudget = $derived(
		this.#toDisplay(Math.max(0, this.#effectiveBudget - this.#rawSpentAmount))
	);

	readonly spentPercent = $derived(
		this.#effectiveBudget > 0 ? Math.round((this.#rawSpentAmount / this.#effectiveBudget) * 100) : 0
	);

	readonly changePercent = $derived(
		this.#effectiveBudget > 0
			? `–${((this.#rawSpentAmount / this.#effectiveBudget) * 100).toFixed(1)}%`
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

	readonly #totalPeriodDays = $derived.by(() => {
		const start = getPeriodStart(this.#nextPayday, settingsVM.payday);
		const msPerDay = 1000 * 60 * 60 * 24;
		return Math.max(1, Math.round((this.#nextPayday.getTime() - start.getTime()) / msPerDay));
	});

	readonly dailyBudget = $derived(
		Math.floor(this.#toDisplay(this.totalBudget) / this.#totalPeriodDays)
	);

	readonly todaySpent = $derived(
		accountsVM.active ? this.#toDisplay(getTodaySpent(expensesVM.expenses, accountsVM.active.id)) : 0
	);

	readonly dailyRemaining = $derived(
		Math.floor(this.remainingBudget / Math.max(1, this.daysUntilEnd))
	);

	readonly monthlyRemaining = $derived(this.remainingBudget);

	readonly hasExpenses = $derived(this.accountExpenses.length > 0);

	readonly quickChips = $derived(getRecentUnique(expensesVM.expenses, categoriesVM.categories, 5));

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
				return { icon, label: cat?.label ?? icon, sum: this.#toDisplay(sum), color: cat?.border ?? '' };
			})
			.sort((a, b) => b.sum - a.sum)
	);

	readonly weeklyAmounts = $derived(
		getWeeklyAmounts(this.accountExpenses).map((v) => this.#toDisplay(v))
	);

	readonly weekExpenses = $derived.by(() => {
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const filtered = this.accountExpenses.filter((e) => e.date && new Date(e.date) >= weekAgo);
		return groupByDate(filtered);
	});

	setPeriod(p: 'week' | 'month' | 'year') {
		this.activePeriod = p;
	}
}
