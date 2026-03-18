import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import * as m from '$lib/paraglide/messages.js';

export class AddAccountSheetViewModel {
	isOpen = $state(false);
	name = $state('');
	budget = $state<number | null>(null);
	type = $state('savings');
	currency = $state(settingsVM.currency);
	goalAmount = $state<number | null>(null);

	readonly canSave = $derived(this.name.trim().length > 0);

	open() {
		this.isOpen = true;
		this.name = '';
		this.budget = null;
		this.type = 'savings';
		this.currency = settingsVM.currency;
		this.goalAmount = null;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave) return;
		const budget = this.budget ?? 0;
		accountsVM.add({
			type: this.type,
			name: this.name.trim(),
			balance: budget,
			budget: budget,
			spent: 0,
			currency: this.currency,
			label:
				this.type === 'savings' ? m.add_account_type_savings() : m.account_label_monthly_budget(),
			goalAmount: this.type === 'savings' && this.goalAmount ? this.goalAmount : undefined
		});
		this.close();
	}
}
