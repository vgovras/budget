import type { Settings } from '$lib/types.js';
import { DEFAULT_SETTINGS } from '$lib/constants.js';
import { SettingsRepository } from './settings.js';

export class SettingsViewModel {
	#repo: SettingsRepository;

	budget = $state(DEFAULT_SETTINGS.budget);
	salary = $state(DEFAULT_SETTINGS.salary);
	payday = $state(DEFAULT_SETTINGS.payday);
	currency = $state(DEFAULT_SETTINGS.currency);
	notifications = $state(DEFAULT_SETTINGS.notifications);
	warning = $state(DEFAULT_SETTINGS.warning);
	catLimits = $state<Record<string, number>>({});
	onboardingDone = $state(false);
	lastPayday = $state('');
	loaded = $state(false);

	constructor(repo: SettingsRepository) {
		this.#repo = repo;
		// Defer loading to avoid SSR localStorage access
		if (typeof window !== 'undefined') {
			this.#hydrate();
		}
	}

	#hydrate() {
		const saved = this.#repo.load();
		if (saved) {
			this.budget = saved.budget;
			this.salary = saved.salary;
			this.payday = saved.payday;
			this.currency = saved.currency;
			this.notifications = saved.notifications;
			this.warning = saved.warning;
			this.catLimits = saved.catLimits ?? {};
			this.onboardingDone = saved.onboardingDone ?? false;
			this.lastPayday = saved.lastPayday ?? '';
		}
		this.loaded = true;
	}

	updateBudget(val: number) {
		this.budget = val;
		this.#save();
	}

	updateSalary(val: number) {
		this.salary = val;
		this.#save();
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

	setCatLimit(icon: string, limit: number) {
		this.catLimits = { ...this.catLimits, [icon]: limit };
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
		this.budget = DEFAULT_SETTINGS.budget;
		this.salary = DEFAULT_SETTINGS.salary;
		this.payday = DEFAULT_SETTINGS.payday;
		this.currency = DEFAULT_SETTINGS.currency;
		this.notifications = DEFAULT_SETTINGS.notifications;
		this.warning = DEFAULT_SETTINGS.warning;
		this.catLimits = {};
		this.onboardingDone = false;
		this.lastPayday = '';
		this.#repo.clear();
	}

	#save() {
		this.#repo.save(this.#snapshot());
	}

	#snapshot(): Settings {
		return {
			budget: this.budget,
			salary: this.salary,
			payday: this.payday,
			currency: this.currency,
			notifications: this.notifications,
			warning: this.warning,
			catLimits: this.catLimits,
			onboardingDone: this.onboardingDone,
			lastPayday: this.lastPayday
		};
	}
}

export const settingsVM = new SettingsViewModel(new SettingsRepository());
