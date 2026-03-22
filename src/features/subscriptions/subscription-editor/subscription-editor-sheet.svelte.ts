import type { Subscription } from '$lib/types.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { subscriptionsVM } from '../subscriptions.svelte.js';
import { SUBSCRIPTION_ICON_PRESETS, CURRENCIES } from '$lib/constants.js';

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

	readonly presets = SUBSCRIPTION_ICON_PRESETS;
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
		this.currency = accountsVM.active?.currency ?? settingsVM.currency;
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
