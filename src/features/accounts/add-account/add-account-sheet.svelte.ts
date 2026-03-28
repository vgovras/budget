import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';

export class AddAccountSheetViewModel {
	isOpen = $state(false);
	name = $state('');
	balance = $state<number | null>(null);
	currency = $state(settingsVM.currency);

	readonly canSave = $derived(this.name.trim().length > 0);

	open() {
		this.isOpen = true;
		this.name = '';
		this.balance = null;
		this.currency = settingsVM.currency;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave) return;
		accountsVM.add({
			name: this.name.trim(),
			balance: this.balance ?? 0,
			currencyCode: this.currency
		});
		accountsVM.setActive(accountsVM.accounts.length - 1);
		this.close();
	}
}
