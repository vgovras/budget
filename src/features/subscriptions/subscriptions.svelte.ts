import type { Subscription } from '$lib/types.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { convert } from '$lib/utils/currency.js';
import { nowISO } from '$lib/utils/format.js';
import { SubscriptionsRepository } from './subscriptions.js';
import { syncToServer } from '$lib/utils/sync.js';

function advanceDate(date: Date, cycle: Subscription['cycle']): Date {
	const next = new Date(date);
	switch (cycle) {
		case 'monthly':
			next.setMonth(next.getMonth() + 1);
			break;
		case 'quarterly':
			next.setMonth(next.getMonth() + 3);
			break;
		case 'yearly':
			next.setFullYear(next.getFullYear() + 1);
			break;
	}
	return next;
}

export class SubscriptionsViewModel {
	#repo: SubscriptionsRepository;

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

	constructor(repo: SubscriptionsRepository) {
		this.#repo = repo;
		if (typeof window !== 'undefined') {
			this.#hydrate();
			this.#processDue();
		}
	}

	#hydrate() {
		this.items = this.#repo.load() ?? [];
	}

	add(data: Omit<Subscription, 'id'>) {
		const sub: Subscription = { ...data, id: 'sub-' + Date.now() };
		this.items = [...this.items, sub];
		this.#save();
	}

	update(id: string, patch: Partial<Subscription>) {
		this.items = this.items.map((s) => (s.id === id ? { ...s, ...patch } : s));
		this.#save();
	}

	remove(id: string) {
		this.items = this.items.filter((s) => s.id !== id);
		this.#save();
	}

	resetAll() {
		this.items = [];
		this.#repo.clear();
		syncToServer('/api/user', 'PATCH', { subscriptions: this.items });
	}

	#save() {
		this.#repo.save(this.items);
		syncToServer('/api/user', 'PATCH', { subscriptions: this.items });
	}

	toggle(id: string) {
		const sub = this.items.find((s) => s.id === id);
		if (!sub) return;
		this.update(id, { status: sub.status === 'active' ? 'paused' : 'active' });
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

		const chargeAmount = acc.currency === sub.currency
			? sub.amount
			: convert(sub.amount, sub.currency, acc.currency);

		accountsVM.update(acc.id, { balance: acc.balance - chargeAmount });

		expensesVM.add({
			icon: sub.icon,
			label: sub.label,
			note: sub.label,
			amount: chargeAmount,
			day: 'today',
			date: nowISO(),
			accountId: acc.id,
			type: 'subscription',
		});
	}
}

export const subscriptionsVM = new SubscriptionsViewModel(new SubscriptionsRepository());
