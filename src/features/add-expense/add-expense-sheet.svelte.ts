import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { getAccStats, getTodaySpent } from '$lib/utils/budget.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { getRate, convert } from '$lib/utils/currency.js';
import { getRecentUnique, type QuickChip } from './quick-chips/quick-chips.js';
import { nowISO, isoToDateInput, dateInputToISO } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export class AddExpenseSheetViewModel {
	isOpen = $state(false);
	amount = $state<number | null>(null);
	note = $state('');
	sheetType = $state<'expense' | 'income' | 'transfer'>('expense');
	selectedCategory = $state<string | null>(null);
	selectedDate = $state('');
	selectedAccountId = $state('');
	toAccountId = $state('');
	exchangeRate = $state(1);

	readonly selectedAccount = $derived(
		accountsVM.accounts.find((a) => a.id === this.selectedAccountId) ?? accountsVM.active
	);

	readonly toAccount = $derived(
		accountsVM.accounts.find((a) => a.id === this.toAccountId)
	);

	readonly isCrossCurrency = $derived(
		this.sheetType === 'transfer' && this.selectedAccount && this.toAccount
			? this.selectedAccount.currency !== this.toAccount.currency
			: false
	);

	readonly autoRate = $derived(
		this.selectedAccount && this.toAccount
			? getRate(this.selectedAccount.currency, this.toAccount.currency)
			: 1
	);

	readonly convertedAmount = $derived(
		this.amount && this.exchangeRate ? Math.round(this.amount * this.exchangeRate) : 0
	);

	readonly canSave = $derived(
		this.amount !== null && this.amount > 0 &&
		(this.sheetType !== 'transfer' || (this.toAccountId !== '' && this.toAccountId !== this.selectedAccountId))
	);

	readonly dailyRemaining = $derived.by(() => {
		const acc = this.selectedAccount;
		if (!acc) return 0;
		const budget = acc.budget || settingsVM.budget;
		const spent = getAccStats(expensesVM.expenses, acc.id);
		const remaining = Math.max(0, budget - spent);

		const salary = recurringVM.items.find((r) => r.id === 'rec-salary');
		const nextPayday = salary?.nextDate
			? new Date(salary.nextDate)
			: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		const daysLeft = Math.max(1, Math.ceil((nextPayday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

		const dailyBudget = Math.floor(settingsVM.toDisplay(remaining, acc.currency) / daysLeft);
		const todaySpent = settingsVM.toDisplay(getTodaySpent(expensesVM.expenses, acc.id), acc.currency);
		return Math.max(0, dailyBudget - todaySpent);
	});

	readonly displayCurrency = $derived(
		settingsVM.fiatViewEnabled
			? settingsVM.fiatCurrency
			: (this.selectedAccount?.currency ?? settingsVM.currency)
	);

	readonly quickChips = $derived(getRecentUnique(expensesVM.expenses, categoriesVM.categories, 3));

	#prevToAccountId = '';

	syncExchangeRate() {
		if (this.toAccountId !== this.#prevToAccountId) {
			this.#prevToAccountId = this.toAccountId;
			this.exchangeRate = Math.round(this.autoRate * 10000) / 10000;
		}
	}

	open() {
		this.isOpen = true;
		this.amount = null;
		this.note = '';
		this.selectedDate = isoToDateInput(nowISO());
		this.selectedCategory = null;
		this.selectedAccountId = accountsVM.active?.id ?? '';
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

	private toAccountCurrency(entered: number): number {
		if (!settingsVM.fiatViewEnabled) return entered;
		const acc = this.selectedAccount;
		if (!acc || acc.currency === settingsVM.fiatCurrency) return entered;
		return convert(entered, settingsVM.fiatCurrency, acc.currency);
	}

	private get isFiatConversion(): boolean {
		const acc = this.selectedAccount;
		return settingsVM.fiatViewEnabled && !!acc && acc.currency !== settingsVM.fiatCurrency;
	}

	#syncActiveAccount(accountId: string) {
		const idx = accountsVM.accounts.findIndex((a) => a.id === accountId);
		if (idx >= 0 && idx !== accountsVM.activeIdx) {
			accountsVM.setActive(idx);
		}
	}

	save() {
		if (!this.canSave || !this.amount) return;
		const acc = this.selectedAccount;
		if (!acc) return;
		const entered = this.amount;
		const nativeAmount = this.sheetType === 'transfer' ? entered : this.toAccountCurrency(entered);
		const isoDate = this.selectedDate ? dateInputToISO(this.selectedDate) : nowISO();
		const fiatFields = this.isFiatConversion
			? { displayAmount: entered, displayCurrency: settingsVM.fiatCurrency }
			: {};

		this.#syncActiveAccount(acc.id);

		if (this.sheetType === 'transfer') {
			const to = this.toAccount;
			if (!to) return;
			const credited = this.isCrossCurrency ? this.convertedAmount : nativeAmount;
			accountsVM.update(acc.id, { balance: acc.balance - nativeAmount });
			accountsVM.update(to.id, { balance: to.balance + credited });
			expensesVM.add({
				icon: 'arrow-left-right',
				label: `${acc.name} → ${to.name}`,
				note: this.note || `${acc.name} → ${to.name}`,
				amount: nativeAmount,
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
			const netAmount = commission > 0 ? Math.round(nativeAmount * (1 - commission / 100)) : nativeAmount;
			accountsVM.update(acc.id, { balance: acc.balance + netAmount });
			expensesVM.add({
				icon: cat?.icon ?? 'wallet',
				label: cat?.label ?? m.income_label(),
				note: this.note || m.income_label(),
				amount: nativeAmount,
				day: 'today',
				date: isoDate,
				accountId: acc.id,
				type: 'income',
				commission: commission > 0 ? commission : undefined,
				netAmount: commission > 0 ? netAmount : undefined,
				...fiatFields,
			});
		} else {
			const cats = categoriesVM.categories;
			const cat = cats.find((c) => c.icon === this.selectedCategory) || cats[0];
			accountsVM.update(acc.id, { balance: acc.balance - nativeAmount });
			expensesVM.add({
				icon: cat.icon,
				label: cat.label,
				note: this.note || cat.label,
				amount: nativeAmount,
				day: 'today',
				date: isoDate,
				accountId: acc.id,
				type: 'expense',
				...fiatFields,
			});
		}

		this.close();
	}
}
