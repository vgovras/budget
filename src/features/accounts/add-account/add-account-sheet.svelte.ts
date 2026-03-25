import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import * as m from '$lib/paraglide/messages.js';

export class AddAccountSheetViewModel {
	isOpen = $state(false);
	name = $state('');
	budget = $state<number | null>(null);
	currency = $state(settingsVM.currency);

	readonly canSave = $derived(this.name.trim().length > 0);

	open() {
		this.isOpen = true;
		this.name = '';
		this.budget = null;
		this.currency = settingsVM.currency;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave) return;
		const budget = this.budget ?? 0;
		accountsVM.add({
			type: 'card',
			name: this.name.trim(),
			balance: budget,
			budget: budget,
			spent: 0,
			currency: this.currency,
			label: m.account_label_monthly_budget()
		});
		accountsVM.setActive(accountsVM.accounts.length - 1);
		this.close();
	}
}
