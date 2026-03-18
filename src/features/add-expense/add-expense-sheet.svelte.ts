import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { getDailyBudget } from '$lib/utils/budget.js';
import { getRecentUnique, type QuickChip } from './quick-chips/quick-chips.js';
import { nowISO } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export class AddExpenseSheetViewModel {
	isOpen = $state(false);
	amount = $state<number | null>(null);
	note = $state('');
	sheetType = $state<'expense' | 'income'>('expense');
	selectedCategory = $state<string | null>(null);
	tagInput = $state('');
	tags = $state<string[]>([]);

	readonly allTags = $derived(
		[...new Set(expensesVM.expenses.flatMap((e) => e.tags ?? []))].sort()
	);

	readonly tagSuggestions = $derived(
		this.tagInput.trim()
			? this.allTags.filter(
					(t) =>
						t.toLowerCase().includes(this.tagInput.trim().toLowerCase()) &&
						!this.tags.includes(t)
				)
			: []
	);

	readonly canSave = $derived(this.amount !== null && this.amount > 0);

	readonly dailyBudget = $derived(
		accountsVM.active ? getDailyBudget(expensesVM.expenses, accountsVM.active, settingsVM.budget) : 0
	);

	readonly quickChips = $derived(getRecentUnique(expensesVM.expenses, 3));

	open() {
		this.isOpen = true;
		this.amount = null;
		this.note = '';
		this.selectedCategory = null;
		this.sheetType = 'expense';
		this.tagInput = '';
		this.tags = [];
	}

	addTag(tag: string) {
		const t = tag.trim();
		if (t && !this.tags.includes(t)) {
			this.tags = [...this.tags, t];
		}
		this.tagInput = '';
	}

	removeTag(tag: string) {
		this.tags = this.tags.filter((t) => t !== tag);
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
		const isoDate = nowISO();

		if (this.sheetType === 'income') {
			const cat = categoriesVM.getByIcon(this.selectedCategory ?? '');
			const commission = cat?.commission ?? 0;
			const netAmount = commission > 0 ? Math.round(amount * (1 - commission / 100)) : amount;
			accountsVM.update(acc.id, { balance: acc.balance + netAmount });
			expensesVM.add({
				icon: cat?.icon ?? 'wallet',
				label: cat?.label ?? m.income_label(),
				note: this.note || m.income_label(),
				amount,
				day: 'today',
				date: isoDate,
				accountId: acc.id,
				type: 'income',
				commission: commission > 0 ? commission : undefined,
				netAmount: commission > 0 ? netAmount : undefined,
				tags: this.tags.length > 0 ? this.tags : undefined
			});
		} else {
			const cats = categoriesVM.categories;
			const cat = cats.find((c) => c.icon === this.selectedCategory) || cats[0];
			accountsVM.update(acc.id, { balance: acc.balance - amount });
			expensesVM.add({
				icon: cat.icon,
				label: cat.label,
				note: this.note || cat.label,
				amount,
				day: 'today',
				date: isoDate,
				accountId: acc.id,
				type: 'expense',
				tags: this.tags.length > 0 ? this.tags : undefined
			});
		}

		this.close();
	}
}
