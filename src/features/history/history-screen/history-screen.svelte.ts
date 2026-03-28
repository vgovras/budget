import type { Expense } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { groupByDate, locale } from '$lib/utils/format.js';

export type TransactionType = 'all' | 'income' | 'expense';
export type SortMode = 'date' | 'amount-desc' | 'amount-asc';

export class HistoryScreenViewModel {
	searchQuery = $state('');
	selectedCategories = $state<Set<string>>(new Set());
	filterPanelOpen = $state(false);
	transactionType = $state<TransactionType>('all');
	sortMode = $state<SortMode>('date');
	dateFrom = $state<Date | null>(null);
	dateTo = $state<Date | null>(null);

	readonly hasActiveFilters = $derived(
		this.transactionType !== 'all' ||
		this.sortMode !== 'date' ||
		this.dateFrom !== null
	);

	readonly hasCustomDateRange = $derived(
		this.dateFrom !== null && this.dateTo !== null
	);

	readonly nativeCurrency = $derived(
		accountsVM.active?.currencyCode ?? settingsVM.currency
	);

	readonly displayCurrency = $derived(
		settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : this.nativeCurrency
	);

	#toDisplay(amount: number) {
		return settingsVM.toDisplay(amount, this.nativeCurrency);
	}

	readonly filtered = $derived.by(() => {
		let base = expensesVM.expenses.filter(
			(e: Expense) => e.accountId === accountsVM.active?.id
		);

		if (this.selectedCategories.size > 0) {
			base = base.filter((e: Expense) => this.selectedCategories.has(e.icon));
		}

		if (this.transactionType === 'income') {
			base = base.filter((e: Expense) => e.type === 'income');
		} else if (this.transactionType === 'expense') {
			base = base.filter((e: Expense) => e.type === 'expense' || e.type === 'subscription');
		}

		if (this.dateFrom && this.dateTo) {
			const from = this.dateFrom.getTime();
			const to = new Date(this.dateTo);
			to.setHours(23, 59, 59, 999);
			const toMs = to.getTime();
			base = base.filter((e: Expense) => {
				if (!e.date) return false;
				const d = new Date(e.date).getTime();
				return d >= from && d <= toMs;
			});
		}

		if (this.searchQuery.trim()) {
			const q = this.searchQuery.trim().toLowerCase();
			base = base.filter(
				(e: Expense) =>
					e.label.toLowerCase().includes(q) ||
					e.note.toLowerCase().includes(q)
			);
		}

		if (this.sortMode === 'amount-desc') {
			base = [...base].sort((a, b) => b.amount - a.amount);
		} else if (this.sortMode === 'amount-asc') {
			base = [...base].sort((a, b) => a.amount - b.amount);
		}

		return base;
	});

	readonly grouped = $derived(
		this.sortMode === 'date' ? groupByDate(this.filtered) : null
	);

	readonly total = $derived(
		this.#toDisplay(
			this.filtered.reduce((s: number, e: Expense) => {
				return e.type === 'income' ? s - e.amount : s + e.amount;
			}, 0)
		)
	);

	// --- Donut chart (based on filtered, shows all types) ---

	readonly donutTotal = $derived(
		this.#toDisplay(this.filtered.reduce((s, e) => s + e.amount, 0))
	);

	readonly byCategory = $derived(
		Object.entries(
			this.filtered.reduce<Record<string, { icon: string; label: string; sum: number; color: string }>>(
				(acc, e) => {
					if (!acc[e.icon]) {
						const cat = categoriesVM.getByIcon(e.icon);
						acc[e.icon] = { icon: e.icon, label: cat?.label ?? e.label, sum: 0, color: cat?.border ?? '' };
					}
					acc[e.icon].sum += this.#toDisplay(e.amount);
					return acc;
				},
				{}
			)
		)
			.map(([, v]) => v)
			.sort((a, b) => b.sum - a.sum)
	);

	readonly periodLabel = $derived.by(() => {
		if (this.hasCustomDateRange) {
			const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
			const loc = locale();
			return `${this.dateFrom!.toLocaleDateString(loc, opts)} — ${this.dateTo!.toLocaleDateString(loc, opts)}`;
		}
		return new Date().toLocaleDateString(locale(), { month: 'long', year: 'numeric' });
	});

	readonly hasData = $derived(this.filtered.length > 0);

	// --- Actions ---

	toggleFilterPanel() {
		this.filterPanelOpen = !this.filterPanelOpen;
	}

	toggleCategory(icon: string) {
		const next = new Set(this.selectedCategories);
		if (next.has(icon)) {
			next.delete(icon);
		} else {
			next.add(icon);
		}
		this.selectedCategories = next;
	}

	clearCategories() {
		this.selectedCategories = new Set();
	}

	isCategorySelected(icon: string): boolean {
		return this.selectedCategories.has(icon);
	}

	setDateRange(from: Date | null, to: Date | null) {
		this.dateFrom = from;
		this.dateTo = to;
	}

	resetFilters() {
		this.transactionType = 'all';
		this.sortMode = 'date';
		this.dateFrom = null;
		this.dateTo = null;
	}
}
