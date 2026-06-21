import type { Expense } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { getTodaySpent, getWeeklyAmounts, daysUntilPayday, dailyAllowance, sumBillsDueBefore, type UpcomingBill } from '$lib/utils/budget.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { subscriptionsVM } from '$features/subscriptions/subscriptions.svelte.js';
import { convert } from '$lib/utils/currency.js';
import { getRecentUnique } from '$features/add-expense/quick-chips/quick-chips.js';
import { groupByDate, locale } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export class HomeScreenViewModel {
	activePeriod = $state<'day' | 'week' | 'month'>('month');

	readonly greeting = $derived.by(() => {
		const hour = new Date().getHours();
		if (hour < 12) return m.home_greeting_morning();
		if (hour < 18) return m.home_greeting_afternoon();
		return m.home_greeting_evening();
	});

	// Home-дашборд завжди про основний (primary) рахунок — «мої гроші до кінця місяця».
	readonly nativeCurrency = $derived(accountsVM.primary?.currencyCode ?? settingsVM.currency);
	readonly currency = $derived(
		settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : this.nativeCurrency
	);

	#toDisplay(amount: number) {
		return settingsVM.toDisplay(amount, this.nativeCurrency);
	}

	readonly accountExpenses = $derived(
		expensesVM.expenses.filter(
			(e: Expense) => e.accountId === accountsVM.primary?.id && e.type === 'expense'
		)
	);

	readonly #rawSpentAmount = $derived(
		this.accountExpenses.reduce((s: number, e: Expense) => s + e.amount, 0)
	);

	readonly spentAmount = $derived(this.#toDisplay(this.#rawSpentAmount));

	readonly accountBalance = $derived(this.#toDisplay(accountsVM.primary?.balance ?? 0));

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

	readonly daysLeft = $derived(daysUntilPayday(this.#nextPayday));

	// Реальні майбутні списання (підписки + regular-витрати) до зарплати — їх віднімаємо.
	readonly #reserve = $derived.by(() => {
		const acc = accountsVM.primary;
		if (!acc) return 0;
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const bills: UpcomingBill[] = [
			...subscriptionsVM.items
				.filter((s) => !s.deleted && s.status === 'active' && s.accountId === acc.id)
				.map((s) => ({ amount: s.amount, currency: s.currency, nextDate: s.nextDate })),
			...recurringVM.items
				.filter((r) => !r.deleted && r.enabled && r.type === 'expense' && r.accountId === acc.id)
				.map((r) => ({ amount: r.amount, currency: acc.currencyCode, nextDate: r.nextDate }))
		];
		return sumBillsDueBefore(bills, now, this.#nextPayday, acc.currencyCode);
	});

	readonly #availableNative = $derived(
		Math.max(0, (accountsVM.primary?.balance ?? 0) - this.#reserve)
	);

	// Головне число: скільки реально можу витрачати на день (заощадження НЕ враховуються).
	readonly dailyBudget = $derived(
		this.#toDisplay(dailyAllowance(this.#availableNative, this.daysLeft))
	);

	readonly todaySpent = $derived(
		accountsVM.primary ? this.#toDisplay(getTodaySpent(expensesVM.expenses, accountsVM.primary.id)) : 0
	);

	readonly dailyRemaining = $derived(this.dailyBudget - this.todaySpent);

	// «Лишилось до зарплати» — доступні гроші мінус реальні майбутні списання.
	readonly monthlyRemaining = $derived(this.#toDisplay(this.#availableNative));

	// ── Бажане використання на день (інформаційно) ──
	// Плановий бюджет: зп − заощадження − підписки, рівномірно на місяць (/30).
	// Не обмежує реальний dailyBudget; лише підказка «скільки варто витрачати».
	readonly recommendedDaily = $derived(
		Math.floor(convert(settingsVM.budget, settingsVM.currency, this.currency) / 30)
	);

	readonly hasRecommendedDaily = $derived(
		settingsVM.savingsPercent > 0 && settingsVM.budget > 0 && this.recommendedDaily > 0
	);

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

	setPeriod(p: 'day' | 'week' | 'month') {
		this.activePeriod = p;
	}
}
