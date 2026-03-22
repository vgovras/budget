import { accountsVM } from '$features/accounts/accounts.svelte.js';

export class EditAccountSheetViewModel {
	isOpen = $state(false);
	accountId = $state('');
	name = $state('');
	balance = $state<number | null>(null);
	budget = $state<number | null>(null);

	readonly account = $derived(accountsVM.accounts.find((a) => a.id === this.accountId));
	readonly isPrimary = $derived(this.account?.isPrimary ?? false);
	readonly canSave = $derived(this.name.trim().length > 0);

	open(id: string) {
		const acc = accountsVM.accounts.find((a) => a.id === id);
		if (!acc) return;
		this.accountId = id;
		this.name = acc.name;
		this.balance = acc.balance;
		this.budget = acc.budget;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave) return;
		accountsVM.update(this.accountId, {
			name: this.name.trim(),
			balance: this.balance ?? 0,
			budget: this.budget ?? 0
		});
		this.close();
	}

	togglePrimary() {
		accountsVM.setPrimary(this.accountId);
	}

	delete() {
		accountsVM.remove(this.accountId);
		this.close();
	}
}
