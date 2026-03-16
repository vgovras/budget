import type { Account } from '$lib/types.js';
import { expensesVM } from '../expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';

export class EditExpenseViewModel {
	editingId = $state<number | null>(null);
	amount = $state(0);
	note = $state('');
	title = $state('');

	readonly isOpen = $derived(this.editingId !== null);

	open(id: number) {
		const exp = expensesVM.expenses.find((e) => e.id === id);
		if (!exp) return;
		this.editingId = id;
		this.amount = exp.amount;
		this.note = exp.note;
		this.title = exp.label;
	}

	close() {
		this.editingId = null;
	}

	save() {
		if (this.editingId === null || this.amount <= 0) return;
		const exp = expensesVM.expenses.find((e) => e.id === this.editingId);
		if (!exp) return;

		const diff = this.amount - exp.amount;
		const acc = accountsVM.accounts.find((a: Account) => a.id === exp.accountId);
		if (acc && exp.type !== 'income') {
			accountsVM.update(acc.id, {
				spent: Math.max(0, (acc.spent || 0) + diff),
				balance: Math.max(0, (acc.balance || 0) - diff)
			});
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
			if (acc && exp.type !== 'income') {
				accountsVM.update(acc.id, {
					spent: Math.max(0, (acc.spent || 0) - exp.amount),
					balance: (acc.balance || 0) + exp.amount
				});
			}
			expensesVM.remove(this.editingId);
		}
		this.close();
	}
}
