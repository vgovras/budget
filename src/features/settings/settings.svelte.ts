import type { Settings } from '$lib/types.js';
import { DEFAULT_SETTINGS } from '$lib/constants.js';
import { convert } from '$lib/utils/currency.js';
import { SettingsRepository } from './settings.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { markDirty } from '$lib/utils/sync.js';

export class SettingsViewModel {
	#repo = new SettingsRepository();

	#systemPref = $state<'dark' | 'light'>('dark');

	payday = $state(DEFAULT_SETTINGS.payday);
	currency = $state(DEFAULT_SETTINGS.currency);
	notifications = $state(DEFAULT_SETTINGS.notifications);
	warning = $state(DEFAULT_SETTINGS.warning);
	onboardingCompletedAt = $state<string | null>(null);
	readonly onboardingDone = $derived(this.onboardingCompletedAt !== null);
	lastPayday = $state('');
	fiatViewEnabled = $state(false);
	fiatCurrency = $state(DEFAULT_SETTINGS.fiatCurrency);
	savingsPercent = $state(DEFAULT_SETTINGS.savingsPercent);
	theme = $state<'dark' | 'light' | 'system'>('system');
	updatedAt = $state('');
	loaded = $state(false);

	readonly resolvedTheme = $derived<'dark' | 'light'>(
		this.theme === 'system' ? this.#systemPref : this.theme
	);

	readonly salary = $derived(
		recurringVM.items
			.filter((r) => r.type === 'income' && r.enabled)
			.reduce((s, r) => s + r.amount, 0)
	);

	subscriptionsMonthlyTotal = $state(0);

	readonly savingsAmount = $derived(
		this.salary > 0 ? Math.round((this.salary * this.savingsPercent) / 100) : 0
	);

	readonly budget = $derived(Math.max(0, this.salary - this.savingsAmount - this.subscriptionsMonthlyTotal));
	readonly savingsBudget = $derived(Math.max(0, this.salary - this.savingsAmount));

	readonly displayCurrency = $derived(
		this.fiatViewEnabled ? this.fiatCurrency : this.currency
	);

	toDisplay(amount: number, fromCurrency: string): number {
		if (!this.fiatViewEnabled || fromCurrency === this.fiatCurrency) return amount;
		return convert(amount, fromCurrency, this.fiatCurrency);
	}

	constructor() {
		if (typeof window !== 'undefined') {
			const mq = window.matchMedia('(prefers-color-scheme: dark)');
			this.#systemPref = mq.matches ? 'dark' : 'light';
			mq.addEventListener('change', (e) => {
				this.#systemPref = e.matches ? 'dark' : 'light';
				this.#applyTheme();
			});
			this.rehydrate();
		}
	}

	rehydrate() {
		const saved = this.#repo.load();
		if (saved) {
			this.payday = saved.payday ?? DEFAULT_SETTINGS.payday;
			this.currency = saved.currency ?? DEFAULT_SETTINGS.currency;
			this.notifications = saved.notifications ?? DEFAULT_SETTINGS.notifications;
			this.warning = saved.warning ?? DEFAULT_SETTINGS.warning;
			this.onboardingCompletedAt = saved.onboardingCompletedAt ?? null;
			this.lastPayday = saved.lastPayday ?? '';
			this.fiatViewEnabled = saved.fiatViewEnabled ?? false;
			this.fiatCurrency = saved.fiatCurrency ?? DEFAULT_SETTINGS.fiatCurrency;
			this.savingsPercent = saved.savingsPercent ?? 0;
			this.theme = saved.theme ?? 'system';
			this.updatedAt = saved.updatedAt ?? '';
		}
		this.loaded = true;
		this.#applyTheme();
	}

	updatePayday(val: number) { this.payday = val; this.#save(); }
	toggleNotifications() { this.notifications = !this.notifications; this.#save(); }
	toggleWarning() { this.warning = !this.warning; this.#save(); }

	toggleTheme() {
		const order: Array<'system' | 'light' | 'dark'> = ['system', 'light', 'dark'];
		this.theme = order[(order.indexOf(this.theme) + 1) % 3];
		this.#applyTheme();
		this.#save();
	}

	#applyTheme() {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', this.resolvedTheme);
		}
	}

	toggleFiatView() { this.fiatViewEnabled = !this.fiatViewEnabled; this.#save(); }
	setFiatCurrency(currency: string) { this.fiatCurrency = currency; this.#save(); }
	setSubscriptionsTotal(val: number) { this.subscriptionsMonthlyTotal = val; }
	updateSavingsPercent(pct: number) { this.savingsPercent = Math.max(0, Math.min(100, Math.round(pct))); this.#save(); }
	updateLastPayday(date: string) { this.lastPayday = date; this.#save(); }

	completeOnboarding() {
		this.onboardingCompletedAt = new Date().toISOString();
		this.#save();
	}

	#save() {
		this.updatedAt = new Date().toISOString();
		this.#repo.save(this.#snapshot());
		markDirty();
	}

	#snapshot(): Settings {
		return {
			payday: this.payday,
			currency: this.currency,
			notifications: this.notifications,
			warning: this.warning,
			onboardingCompletedAt: this.onboardingCompletedAt,
			lastPayday: this.lastPayday,
			fiatViewEnabled: this.fiatViewEnabled,
			fiatCurrency: this.fiatCurrency,
			savingsPercent: this.savingsPercent,
			theme: this.theme,
			updatedAt: this.updatedAt
		};
	}
}

export const settingsVM = new SettingsViewModel();
