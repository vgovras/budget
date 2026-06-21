import type { Subscription } from '$lib/types.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { subscriptionsVM } from '../subscriptions.svelte.js';
import { SUBSCRIPTION_ICON_PRESETS, CURRENCIES } from '$lib/constants.js';
import * as m from '$lib/paraglide/messages.js';

const PRESET_LABELS: Record<string, () => string> = {
	sub_preset_cloud_storage: m.sub_preset_cloud_storage,
	sub_preset_gym: m.sub_preset_gym,
	sub_preset_news: m.sub_preset_news,
	sub_preset_gaming: m.sub_preset_gaming,
	sub_preset_mobile: m.sub_preset_mobile,
	sub_preset_internet: m.sub_preset_internet,
	sub_preset_rent: m.sub_preset_rent,
	sub_preset_electricity: m.sub_preset_electricity,
	sub_preset_water: m.sub_preset_water,
	sub_preset_gas: m.sub_preset_gas,
	sub_preset_car_insurance: m.sub_preset_car_insurance,
	sub_preset_health_insurance: m.sub_preset_health_insurance,
	sub_preset_email: m.sub_preset_email,
	sub_preset_maps: m.sub_preset_maps,
	sub_preset_podcast: m.sub_preset_podcast,
	sub_preset_password_manager: m.sub_preset_password_manager,
	sub_preset_other: m.sub_preset_other
};

function computeNextDate(dayOfMonth: number, cycle: Subscription['cycle']): string {
	const now = new Date();
	const day = Math.min(dayOfMonth, 28);
	let next = new Date(now.getFullYear(), now.getMonth(), day);
	if (next <= now) {
		if (cycle === 'yearly') next.setFullYear(next.getFullYear() + 1);
		else if (cycle === 'quarterly') next.setMonth(next.getMonth() + 3);
		else next.setMonth(next.getMonth() + 1);
	}
	return next.toISOString();
}

export class SubscriptionEditorSheetViewModel {
	isOpen = $state(false);
	editingId = $state<string | null>(null);

	icon = $state('tv');
	label = $state('');
	amount = $state<number | null>(null);
	currency = $state(settingsVM.currency);
	accountId = $state('');
	cycle = $state<Subscription['cycle']>('monthly');
	dayOfMonth = $state(1);

	readonly presets = $derived(
		SUBSCRIPTION_ICON_PRESETS.map((p) => ({
			icon: p.icon,
			label: p.labelKey ? (PRESET_LABELS[p.labelKey]?.() ?? p.label) : p.label
		}))
	);
	readonly currencies = CURRENCIES;

	readonly isEditing = $derived(this.editingId !== null);

	readonly canSave = $derived(
		this.label.trim().length > 0 &&
		this.amount !== null && this.amount > 0 &&
		this.accountId !== ''
	);

	openNew() {
		this.editingId = null;
		this.icon = 'tv';
		this.label = '';
		this.#lastPresetLabel = '';
		this.amount = null;
		this.currency = accountsVM.active?.currencyCode ?? settingsVM.currency;
		this.accountId = accountsVM.active?.id ?? '';
		this.cycle = 'monthly';
		this.dayOfMonth = 1;
		this.isOpen = true;
	}

	openEdit(id: string) {
		const sub = subscriptionsVM.items.find((s) => s.id === id);
		if (!sub) return;
		this.editingId = id;
		this.icon = sub.icon;
		this.label = sub.label;
		this.amount = sub.amount;
		this.currency = sub.currency;
		this.accountId = sub.accountId;
		this.cycle = sub.cycle;
		this.dayOfMonth = sub.dayOfMonth;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
		this.editingId = null;
	}

	#lastPresetLabel = '';

	selectPreset(preset: { icon: string; label: string }) {
		if (!this.label.trim() || this.label === this.#lastPresetLabel) {
			this.label = preset.label;
		}
		this.icon = preset.icon;
		this.#lastPresetLabel = preset.label;
	}

	save() {
		if (!this.canSave || this.amount === null) return;

		const data = {
			icon: this.icon,
			label: this.label.trim(),
			amount: this.amount,
			currency: this.currency,
			accountId: this.accountId,
			cycle: this.cycle,
			dayOfMonth: this.dayOfMonth,
			nextDate: computeNextDate(this.dayOfMonth, this.cycle),
			status: 'active' as const,
		};

		if (this.editingId) {
			subscriptionsVM.update(this.editingId, data);
		} else {
			subscriptionsVM.add(data);
		}
		this.close();
	}

	delete() {
		if (this.editingId) {
			subscriptionsVM.remove(this.editingId);
		}
		this.close();
	}
}
