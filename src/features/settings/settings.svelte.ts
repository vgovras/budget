import type { Settings } from '$lib/types.js';
import { DEFAULT_SETTINGS } from '$lib/constants.js';
import { convert } from '$lib/utils/currency.js';
import { SettingsRepository } from './settings.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';

export class SettingsViewModel {
	#repo: SettingsRepository;

	#systemTheme(): 'dark' | 'light' {
		if (typeof window === 'undefined') return 'dark';
		return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
	}

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
	theme = $state<'dark' | 'light'>('dark');
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
			this.onboardingCompletedAt = (saved as any).onboardingCompletedAt ?? (saved.onboardingDone ? new Date().toISOString() : null);
			this.lastPayday = saved.lastPayday ?? '';
			this.fiatViewEnabled = saved.fiatViewEnabled ?? false;
			this.fiatCurrency = (saved as any).fiatCurrency ?? saved.currency ?? DEFAULT_SETTINGS.fiatCurrency;
			this.savingsPercent = (saved as any).savingsPercent ?? 0;
			this.theme = (saved as any).theme ?? this.#systemTheme();
		}
		this.loaded = true;
		this.#applyTheme();
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

	toggleTheme() {
		this.theme = this.theme === 'dark' ? 'light' : 'dark';
		this.#applyTheme();
		this.#save();
	}

	#applyTheme() {
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('data-theme', this.theme);
		}
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
		this.onboardingCompletedAt = new Date().toISOString();
		this.#save();
	}

	resetAll() {
		this.payday = DEFAULT_SETTINGS.payday;
		this.currency = DEFAULT_SETTINGS.currency;
		this.notifications = DEFAULT_SETTINGS.notifications;
		this.warning = DEFAULT_SETTINGS.warning;
		this.onboardingCompletedAt = null;
		this.lastPayday = '';
		this.fiatViewEnabled = false;
		this.fiatCurrency = DEFAULT_SETTINGS.fiatCurrency;
		this.savingsPercent = 0;
		this.theme = 'dark';
		this.#applyTheme();
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
			onboardingCompletedAt: this.onboardingCompletedAt,
			lastPayday: this.lastPayday,
			fiatViewEnabled: this.fiatViewEnabled,
			fiatCurrency: this.fiatCurrency,
			savingsPercent: this.savingsPercent,
			theme: this.theme
		};
	}
}

export const settingsVM = new SettingsViewModel(new SettingsRepository());
