import type { Account, Expense } from '$lib/types.js';
import { expensesVM } from '../expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { convert } from '$lib/utils/currency.js';

function findAccount(id: string | undefined) {
	if (!id) return undefined;
	return accountsVM.accounts.find((a: Account) => a.id === id);
}

function getCredited(exp: Expense) {
	return exp.exchangeRate ? Math.round(exp.amount * exp.exchangeRate) : exp.amount;
}

function getNetAmount(amount: number, commission: number | undefined) {
	return commission && commission > 0
		? Math.round(amount * (1 - commission / 100))
		: amount;
}

export class EditExpenseViewModel {
	editingId = $state<number | null>(null);
	amount = $state(0);
	note = $state('');
	title = $state('');
	isOpen = $state(false);

	readonly displayCurrency = $derived(
		settingsVM.fiatViewEnabled
			? settingsVM.fiatCurrency
			: (this.#accountCurrency ?? settingsVM.currency)
	);

	get #accountCurrency() {
		if (this.editingId === null) return undefined;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		return exp ? findAccount(exp.accountId)?.currency : undefined;
	}

	open(id: number) {
		const exp = expensesVM.expenses.find((e) => e.id === id);
		if (!exp) return;
		this.editingId = id;
		this.amount = exp.displayAmount && settingsVM.fiatViewEnabled && exp.displayCurrency === settingsVM.fiatCurrency
			? exp.displayAmount
			: this.#toDisplay(exp.amount, exp.accountId);
		this.note = exp.note;
		this.title = exp.label;
		this.isOpen = true;
	}

	#toDisplay(amount: number, accountId: string): number {
		if (!settingsVM.fiatViewEnabled) return amount;
		const accCurrency = findAccount(accountId)?.currency;
		if (!accCurrency || accCurrency === settingsVM.fiatCurrency) return amount;
		return convert(amount, accCurrency, settingsVM.fiatCurrency);
	}

	#toAccountCurrency(displayAmount: number, accountId: string): number {
		if (!settingsVM.fiatViewEnabled) return displayAmount;
		const accCurrency = findAccount(accountId)?.currency;
		if (!accCurrency || accCurrency === settingsVM.fiatCurrency) return displayAmount;
		return convert(displayAmount, settingsVM.fiatCurrency, accCurrency);
	}

	close() {
		this.isOpen = false;
		this.editingId = null;
	}

	save() {
		if (this.editingId === null || this.amount <= 0) return;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		if (!exp) return;

		const nativeAmount = exp.type === 'transfer'
			? this.amount
			: this.#toAccountCurrency(this.amount, exp.accountId);
		const diff = nativeAmount - exp.amount;
		const acc = findAccount(exp.accountId);

		if (exp.type === 'transfer') {
			this.#saveTransfer(exp, acc, diff);
		} else if (exp.type === 'income') {
			this.#saveIncome(exp, acc, nativeAmount);
		} else if (acc) {
			accountsVM.update(acc.id, { balance: acc.balance - diff });
		}

		const patch: Partial<Expense> = { amount: nativeAmount, note: this.note };
		if (exp.type === 'income' && exp.commission && exp.commission > 0) {
			patch.netAmount = getNetAmount(nativeAmount, exp.commission);
		}
		expensesVM.update(this.editingId, patch);
		this.close();
	}

	delete() {
		if (this.editingId === null) return;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		if (!exp) return;

		const acc = findAccount(exp.accountId);

		if (exp.type === 'transfer') {
			this.#deleteTransfer(exp, acc);
		} else if (exp.type === 'income') {
			if (acc) {
				const net = exp.netAmount ?? exp.amount;
				accountsVM.update(acc.id, { balance: acc.balance - net });
			}
		} else if (acc) {
			accountsVM.update(acc.id, { balance: acc.balance + exp.amount });
		}

		expensesVM.remove(this.editingId);
		this.close();
	}

	#saveTransfer(exp: Expense, acc: Account | undefined, diff: number) {
		if (acc) {
			accountsVM.update(acc.id, { balance: acc.balance - diff });
		}
		const toAcc = findAccount(exp.toAccountId);
		if (toAcc) {
			const oldCredited = getCredited(exp);
			const newCredited = exp.exchangeRate
				? Math.round(this.amount * exp.exchangeRate)
				: this.amount;
			accountsVM.update(toAcc.id, { balance: toAcc.balance - oldCredited + newCredited });
		}
	}

	#saveIncome(exp: Expense, acc: Account | undefined, nativeAmount: number) {
		if (!acc) return;
		const oldNet = exp.netAmount ?? exp.amount;
		const newNet = getNetAmount(nativeAmount, exp.commission);
		accountsVM.update(acc.id, { balance: acc.balance + (newNet - oldNet) });
	}

	#deleteTransfer(exp: Expense, acc: Account | undefined) {
		if (acc) {
			accountsVM.update(acc.id, { balance: acc.balance + exp.amount });
		}
		const toAcc = findAccount(exp.toAccountId);
		if (toAcc) {
			accountsVM.update(toAcc.id, { balance: toAcc.balance - getCredited(exp) });
		}
	}
}
