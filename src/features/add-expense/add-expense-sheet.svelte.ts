import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { CATEGORIES } from '$lib/constants.js';
import { getDailyBudget } from '$lib/utils/budget.js';
import { getRecentUnique, type QuickChip } from './quick-chips/quick-chips.js';
import * as m from '$lib/paraglide/messages.js';

export class AddExpenseSheetViewModel {
	isOpen = $state(false);
	amount = $state<number | null>(null);
	note = $state('');
	sheetType = $state<'expense' | 'income'>('expense');
	selectedCategory = $state<string | null>(null);

	readonly canSave = $derived(this.amount !== null && this.amount > 0);

	readonly dailyBudget = $derived(
		accountsVM.active ? getDailyBudget(expensesVM.expenses, accountsVM.active) : 0
	);

	readonly quickChips = $derived(getRecentUnique(expensesVM.expenses, 3));

	open() {
		this.isOpen = true;
		this.amount = null;
		this.note = '';
		this.selectedCategory = null;
		this.sheetType = 'expense';
	}

	close() {
		this.isOpen = false;
	}

	setType(type: 'expense' | 'income') {
		this.sheetType = type;
	}

	selectCategory(icon: string) {
		this.selectedCategory = icon;
	}

	quickFill(chip: QuickChip) {
		this.amount = chip.amount;
		this.note = chip.note;
		this.selectedCategory = chip.icon;
	}

	save() {
		if (!this.canSave || !this.amount) return;
		const acc = accountsVM.active;
		if (!acc) return;
		const amount = this.amount;

		if (this.sheetType === 'income') {
			accountsVM.update(acc.id, { balance: (acc.balance || 0) + amount });
			expensesVM.add({
				icon: 'wallet',
				label: m.income_label(),
				note: this.note || m.income_label(),
				amount,
				day: 'today',
				date: new Date().toISOString(),
				accountId: acc.id,
				type: 'income'
			});
		} else {
			const cat = CATEGORIES.find((c) => c.icon === this.selectedCategory) || CATEGORIES[0];
			accountsVM.update(acc.id, {
				spent: (acc.spent || 0) + amount,
				balance: Math.max(0, (acc.balance || 0) - amount)
			});
			expensesVM.add({
				icon: cat.icon,
				label: cat.label,
				note: this.note || cat.label,
				amount,
				day: 'today',
				date: new Date().toISOString(),
				accountId: acc.id,
				type: 'expense'
			});
		}

		this.close();
	}
}
