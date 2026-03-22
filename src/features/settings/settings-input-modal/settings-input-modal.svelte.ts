import { settingsVM } from '../settings.svelte.js';
import * as m from '$lib/paraglide/messages.js';

export type SettingsInputType = 'payday';

interface FieldConfig {
	title: string;
	currency: boolean;
	subtitle: string;
}

function getFieldMap(): Record<SettingsInputType, FieldConfig> {
	return {
		payday: {
			title: m.settings_payday_label(),
			currency: false,
			subtitle: m.settings_payday_subtitle()
		}
	};
}

export class SettingsInputModalViewModel {
	isOpen = $state(false);
	fieldType = $state<SettingsInputType>('payday');
	value = $state('');

	readonly config = $derived<FieldConfig>(getFieldMap()[this.fieldType]);
	readonly currencySymbol = $derived(settingsVM.currency);

	open(type: SettingsInputType) {
		this.fieldType = type;
		this.value = String(settingsVM.payday);
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		const num = parseFloat(this.value) || 0;
		settingsVM.updatePayday(Math.max(1, Math.min(31, Math.round(num))));
		this.close();
	}
}
