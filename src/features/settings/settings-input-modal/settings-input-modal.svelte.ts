import { settingsVM } from '../settings.svelte.js';
import * as m from '$lib/paraglide/messages.js';

export type SettingsInputType = 'budget' | 'salary' | 'payday' | 'cat-limit';

interface FieldConfig {
	title: string;
	currency: boolean;
	subtitle: string;
	isText?: boolean;
}

function getFieldMap(): Record<Exclude<SettingsInputType, 'cat-limit'>, FieldConfig> {
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
	catIcon = $state('');
	catLabel = $state('');

	readonly config = $derived<FieldConfig>(
		this.fieldType === 'cat-limit'
			? { title: this.catLabel, currency: true, subtitle: m.settings_cat_limit_subtitle() }
			: getFieldMap()[this.fieldType]
	);

	open(type: Exclude<SettingsInputType, 'cat-limit'>) {
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

	openCatLimit(icon: string, label: string) {
		this.fieldType = 'cat-limit';
		this.catIcon = icon;
		this.catLabel = label;
		this.value = settingsVM.catLimits[icon] ? String(settingsVM.catLimits[icon]) : '';
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		const num = parseFloat(this.value) || 0;
		switch (this.fieldType) {
			case 'budget':
				settingsVM.updateBudget(num);
				break;
			case 'salary':
				settingsVM.updateSalary(num);
				break;
			case 'payday':
				settingsVM.updatePayday(Math.max(1, Math.min(31, Math.round(num))));
				break;
			case 'cat-limit':
				settingsVM.setCatLimit(this.catIcon, num);
				break;
		}
		this.close();
	}
}
