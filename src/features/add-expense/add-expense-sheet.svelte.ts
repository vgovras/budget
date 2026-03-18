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
	sheetType = $state<'expense' | 'income' | 'transfer'>('expense');
	selectedCategory = $state<string | null>(null);
	toAccountId = $state('');
	exchangeRate = $state(1);
	readonly toAccount = $derived(
		accountsVM.accounts.find((a) => a.id === this.toAccountId)
	);

	readonly isCrossCurrency = $derived(
		this.sheetType === 'transfer' && accountsVM.active && this.toAccount
			? accountsVM.active.currency !== this.toAccount.currency
			: false
	);

	readonly convertedAmount = $derived(
		this.amount && this.exchangeRate ? Math.round(this.amount * this.exchangeRate) : 0
	);

	readonly canSave = $derived(
		this.amount !== null && this.amount > 0 &&
		(this.sheetType !== 'transfer' || (this.toAccountId !== '' && this.toAccountId !== accountsVM.active?.id))
	);

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
		this.toAccountId = '';
		this.exchangeRate = 1;
	}

	close() {
		this.isOpen = false;
	}

	setType(type: 'expense' | 'income' | 'transfer') {
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

		if (this.sheetType === 'transfer') {
			const to = this.toAccount;
			if (!to) return;
			const credited = this.isCrossCurrency ? this.convertedAmount : amount;
			accountsVM.update(acc.id, { balance: acc.balance - amount });
			accountsVM.update(to.id, { balance: to.balance + credited });
			expensesVM.add({
				icon: 'arrow-left-right',
				label: `${acc.name} → ${to.name}`,
				note: this.note || `${acc.name} → ${to.name}`,
				amount,
				day: 'today',
				date: isoDate,
				accountId: acc.id,
				type: 'transfer',
				toAccountId: to.id,
				exchangeRate: this.isCrossCurrency ? this.exchangeRate : undefined
			});
			this.close();
			return;
		}

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

			});
		}

		this.close();
	}
}
