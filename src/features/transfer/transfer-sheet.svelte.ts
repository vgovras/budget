import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { nowISO } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export class TransferSheetViewModel {
	isOpen = $state(false);
	amount = $state<number | null>(null);
	fromAccountId = $state('');
	toAccountId = $state('');
	exchangeRate = $state(1);
	note = $state('');

	readonly fromAccount = $derived(
		accountsVM.accounts.find((a) => a.id === this.fromAccountId)
	);

	readonly toAccount = $derived(
		accountsVM.accounts.find((a) => a.id === this.toAccountId)
	);

	readonly isCrossCurrency = $derived(
		this.fromAccount && this.toAccount
			? this.fromAccount.currency !== this.toAccount.currency
			: false
	);

	readonly convertedAmount = $derived(
		this.amount && this.exchangeRate ? Math.round(this.amount * this.exchangeRate) : 0
	);

	readonly canSave = $derived(
		this.amount !== null &&
			this.amount > 0 &&
			this.fromAccountId !== '' &&
			this.toAccountId !== '' &&
			this.fromAccountId !== this.toAccountId &&
			(!this.isCrossCurrency || this.exchangeRate > 0)
	);

	open() {
		const accounts = accountsVM.accounts;
		this.isOpen = true;
		this.amount = null;
		this.fromAccountId = accounts[0]?.id ?? '';
		this.toAccountId = accounts.length > 1 ? accounts[1].id : '';
		this.exchangeRate = 1;
		this.note = '';
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave || !this.amount) return;
		const from = this.fromAccount;
		const to = this.toAccount;
		if (!from || !to) return;

		const amount = this.amount;
		const credited = this.isCrossCurrency ? this.convertedAmount : amount;
		const isoDate = nowISO();

		accountsVM.update(from.id, { balance: from.balance - amount });
		accountsVM.update(to.id, { balance: to.balance + credited });

		expensesVM.add({
			icon: 'arrow-left-right',
			label: `${from.name} → ${to.name}`,
			note: this.note || `${from.name} → ${to.name}`,
			amount,
			day: 'today',
			date: isoDate,
			accountId: from.id,
			type: 'transfer',
			toAccountId: to.id,
			exchangeRate: this.isCrossCurrency ? this.exchangeRate : undefined
		});

		this.close();
	}
}
