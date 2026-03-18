import { settingsVM } from '../settings.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import * as m from '$lib/paraglide/messages.js';

export type SettingsInputType = 'budget' | 'salary' | 'payday';

interface FieldConfig {
	title: string;
	currency: boolean;
	subtitle: string;
	isText?: boolean;
}

function getFieldMap(): Record<SettingsInputType, FieldConfig> {
	return {
		budget: {
			title: m.settings_monthly_budget_label(),
			currency: true,
			subtitle: m.settings_monthly_budget_desc()
		},
		salary: {
			title: m.settings_salary_label(),
			currency: true,
			subtitle: m.settings_salary_desc()
		},
		payday: {
			title: m.settings_payday_label(),
			currency: false,
			subtitle: m.settings_payday_subtitle()
		}
	};
}

export class SettingsInputModalViewModel {
	isOpen = $state(false);
	fieldType = $state<SettingsInputType>('budget');
	value = $state('');

	readonly config = $derived<FieldConfig>(getFieldMap()[this.fieldType]);

	open(type: SettingsInputType) {
		this.fieldType = type;
		this.isOpen = true;

		switch (type) {
			case 'budget':
				this.value = String(settingsVM.budget);
				break;
			case 'salary':
				this.value = String(settingsVM.salary);
				break;
			case 'payday':
				this.value = String(settingsVM.payday);
				break;
		}
	}

	close() {
		this.isOpen = false;
	}

	save() {
		const num = parseFloat(this.value) || 0;
		switch (this.fieldType) {
			case 'budget':
				settingsVM.updateBudget(num);
				if (accountsVM.active) {
					accountsVM.update(accountsVM.active.id, { budget: num });
				}
				break;
			case 'salary':
				settingsVM.updateSalary(num);
				break;
			case 'payday':
				settingsVM.updatePayday(Math.max(1, Math.min(31, Math.round(num))));
				break;
		}
		this.close();
	}
}
