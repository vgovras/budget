import type { Account } from '$lib/types.js';
import { expensesVM } from '../expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';

export class EditExpenseViewModel {
	editingId = $state<number | null>(null);
	amount = $state(0);
	note = $state('');
	title = $state('');
	isOpen = $state(false);

	open(id: number) {
		const exp = expensesVM.expenses.find((e) => e.id === id);
		if (!exp) return;
		this.editingId = id;
		this.amount = exp.amount;
		this.note = exp.note;
		this.title = exp.label;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
		this.editingId = null;
	}

	save() {
		if (this.editingId === null || this.amount <= 0) return;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		if (!exp) return;

		const diff = this.amount - exp.amount;
		const acc = accountsVM.accounts.find((a: Account) => a.id === exp.accountId);
		if (acc) {
			// expense: більше витратив → баланс менший
			// income: більше отримав → баланс більший
			const balanceDiff = exp.type === 'income' ? diff : -diff;
			accountsVM.update(acc.id, { balance: acc.balance + balanceDiff });
		}

		expensesVM.update(this.editingId, {
			amount: this.amount,
			note: this.note
		});
		this.close();
	}

	delete() {
		if (this.editingId === null) return;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		if (exp) {
			const acc = accountsVM.accounts.find((a: Account) => a.id === exp.accountId);
			if (acc) {
				// Повернути баланс: expense → +amount, income → -amount
				const balanceDiff = exp.type === 'income' ? -exp.amount : exp.amount;
				accountsVM.update(acc.id, { balance: acc.balance + balanceDiff });
			}
			expensesVM.remove(this.editingId);
		}
		this.close();
	}
}
