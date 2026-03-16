import type { Expense } from '$lib/types.js';
import { CATEGORIES, CAT_COLORS } from '$lib/constants.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';

export interface CatLimitRow {
	icon: string;
	label: string;
	spent: number;
	limit: number;
	pct: number;
	color: string;
}

export class CategoryLimitsViewModel {
	readonly rows = $derived(
		CATEGORIES.map((cat, i) => {
			const limit = settingsVM.catLimits[cat.icon] || 0;
			const spent = expensesVM.expenses
				.filter(
					(e: Expense) =>
						e.accountId === accountsVM.active?.id &&
						e.type !== 'income' &&
						e.icon === cat.icon
				)
				.reduce((s: number, e: Expense) => s + e.amount, 0);
			const pct = limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0;
			const color =
				pct > 90 ? '#ff6060' : pct > 70 ? '#ffb830' : CAT_COLORS[i % CAT_COLORS.length];
			return { icon: cat.icon, label: cat.label, spent, limit, pct, color };
		})
	);

	editCatLimit(icon: string, limit: number) {
		settingsVM.setCatLimit(icon, limit);
	}
}
