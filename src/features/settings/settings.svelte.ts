import type { Settings } from '$lib/types.js';
import { DEFAULT_SETTINGS } from '$lib/constants.js';
import { convert } from '$lib/utils/currency.js';
import { SettingsRepository } from './settings.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';

export class SettingsViewModel {
	#repo: SettingsRepository;

	payday = $state(DEFAULT_SETTINGS.payday);
	currency = $state(DEFAULT_SETTINGS.currency);
	notifications = $state(DEFAULT_SETTINGS.notifications);
	warning = $state(DEFAULT_SETTINGS.warning);
	onboardingDone = $state(false);
	lastPayday = $state('');
	fiatViewEnabled = $state(false);
	fiatCurrency = $state(DEFAULT_SETTINGS.fiatCurrency);
	savingsPercent = $state(DEFAULT_SETTINGS.savingsPercent);
	loaded = $state(false);

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

	constructor(repo: SettingsRepository) {
		this.#repo = repo;
		if (typeof window !== 'undefined') {
			this.#hydrate();
		}
	}

	#hydrate() {
		const saved = this.#repo.load();
		if (saved) {
			this.payday = saved.payday;
			this.currency = saved.currency;
			this.notifications = saved.notifications;
			this.warning = saved.warning;
			this.onboardingDone = saved.onboardingDone ?? false;
			this.lastPayday = saved.lastPayday ?? '';
			this.fiatViewEnabled = saved.fiatViewEnabled ?? false;
			this.fiatCurrency = (saved as any).fiatCurrency ?? saved.currency ?? DEFAULT_SETTINGS.fiatCurrency;
			this.savingsPercent = (saved as any).savingsPercent ?? 0;
		}
		this.loaded = true;
	}

	updatePayday(val: number) {
		this.payday = val;
		this.#save();
	}

	toggleNotifications() {
		this.notifications = !this.notifications;
		this.#save();
	}

	toggleWarning() {
		this.warning = !this.warning;
		this.#save();
	}

	toggleFiatView() {
		this.fiatViewEnabled = !this.fiatViewEnabled;
		this.#save();
	}

	setFiatCurrency(currency: string) {
		this.fiatCurrency = currency;
		this.#save();
	}

	setSubscriptionsTotal(val: number) {
		this.subscriptionsMonthlyTotal = val;
	}

	updateSavingsPercent(pct: number) {
		this.savingsPercent = Math.max(0, Math.min(100, Math.round(pct)));
		this.#save();
	}

	updateLastPayday(date: string) {
		this.lastPayday = date;
		this.#save();
	}

	completeOnboarding() {
		this.onboardingDone = true;
		this.#save();
	}

	resetAll() {
		this.payday = DEFAULT_SETTINGS.payday;
		this.currency = DEFAULT_SETTINGS.currency;
		this.notifications = DEFAULT_SETTINGS.notifications;
		this.warning = DEFAULT_SETTINGS.warning;
		this.onboardingDone = false;
		this.lastPayday = '';
		this.fiatViewEnabled = false;
		this.fiatCurrency = DEFAULT_SETTINGS.fiatCurrency;
		this.savingsPercent = 0;
		this.#repo.clear();
	}

	#save() {
		this.#repo.save(this.#snapshot());
	}

	#snapshot(): Settings {
		return {
			payday: this.payday,
			currency: this.currency,
			notifications: this.notifications,
			warning: this.warning,
			onboardingDone: this.onboardingDone,
			lastPayday: this.lastPayday,
			fiatViewEnabled: this.fiatViewEnabled,
			fiatCurrency: this.fiatCurrency,
			savingsPercent: this.savingsPercent
		};
	}
}

export const settingsVM = new SettingsViewModel(new SettingsRepository());
