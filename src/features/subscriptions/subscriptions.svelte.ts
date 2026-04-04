import type { Subscription } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { convert } from '$lib/utils/currency.js';
import { nowISO } from '$lib/utils/format.js';
import { SubscriptionsRepository } from './subscriptions.js';
import { markDirty } from '$lib/utils/sync.js';
import { uuidv7 } from 'uuidv7';

function advanceDate(date: Date, cycle: Subscription['cycle']): Date {
	const next = new Date(date);
	switch (cycle) {
		case 'monthly': next.setMonth(next.getMonth() + 1); break;
		case 'quarterly': next.setMonth(next.getMonth() + 3); break;
		case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
	}
	return next;
}

export class SubscriptionsViewModel {
	#repo = new SubscriptionsRepository();

	items = $state<Subscription[]>([]);

	readonly active = $derived(this.items.filter((s) => s.status === 'active'));

	readonly monthlyTotal = $derived(
		this.active.reduce((sum, s) => {
			const monthly = s.cycle === 'yearly' ? s.amount / 12
				: s.cycle === 'quarterly' ? s.amount / 3
				: s.amount;
			return sum + settingsVM.toDisplay(Math.round(monthly), s.currency);
		}, 0)
	);

	constructor() {
		if (typeof window !== 'undefined') {
			this.rehydrate();
			this.#processDue();
		}
	}

	rehydrate() {
		this.items = this.#repo.load();
	}

	add(data: Omit<Subscription, 'id' | 'updatedAt'>) {
		const sub: Subscription = { ...data, id: uuidv7(), updatedAt: new Date().toISOString() };
		this.items = [...this.items, sub];
		this.#repo.upsert(sub);
		markDirty();
	}

	update(id: string, patch: Partial<Subscription>) {
		this.items = this.items.map((s) =>
			s.id === id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
		);
		const updated = this.items.find((s) => s.id === id);
		if (updated) this.#repo.upsert(updated);
		markDirty();
	}

	remove(id: string) {
		this.items = this.items.filter((s) => s.id !== id);
		this.#repo.softDelete(id);
		markDirty();
	}

	toggle(id: string) {
		const sub = this.items.find((s) => s.id === id);
		if (sub) this.update(id, { status: sub.status === 'active' ? 'paused' : 'active' });
	}

	#processDue() {
		const now = new Date();
		let changed = false;

		for (const sub of this.items) {
			if (sub.status !== 'active') continue;
			const nextDate = new Date(sub.nextDate);

			while (nextDate <= now) {
				this.#chargeSubscription(sub);
				const advanced = advanceDate(nextDate, sub.cycle);
				nextDate.setTime(advanced.getTime());
				changed = true;
			}

			if (changed) {
				this.update(sub.id, { nextDate: nextDate.toISOString() });
			}
		}
	}

	#chargeSubscription(sub: Subscription) {
		const acc = accountsVM.accounts.find((a) => a.id === sub.accountId);
		if (!acc) return;

		const chargeAmount = acc.currencyCode === sub.currency
			? sub.amount
			: convert(sub.amount, sub.currency, acc.currencyCode);

		accountsVM.update(acc.id, { balance: acc.balance - chargeAmount });

		expensesVM.add({
			icon: sub.icon,
			label: sub.label,
			note: sub.label,
			amount: chargeAmount,
			day: 'today',
			date: nowISO(),
			accountId: acc.id,
			type: 'subscription'
		});
	}
}

export const subscriptionsVM = new SubscriptionsViewModel();
