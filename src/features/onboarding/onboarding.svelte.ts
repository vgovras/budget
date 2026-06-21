import { settingsVM } from '$features/settings/settings.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { expensesVM } from '$features/expenses/expenses.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';
import { subscriptionsVM } from '$features/subscriptions/subscriptions.svelte.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { saveLocalData } from '$lib/utils/store.js';
import { syncNow, startSync } from '$lib/utils/sync.js';
import { authClient } from '$lib/auth-client.js';
import type { UserData } from '$lib/types.js';
import * as m from '$lib/paraglide/messages.js';

export class OnboardingViewModel {
	currentSlide = $state(0);
	maxReachedSlide = $state(0);
	direction = $state<1 | -1>(1);
	visible = $state(true);
	loading = $state(false);

	salary = $state<number | null>(null);
	currency = $state(settingsVM.currency);
	fiatViewEnabled = $state(false);
	fiatCurrency = $state(settingsVM.currency);
	payday = $state(1);
	savingsPercent = $state(20);

	readonly totalSlides = 5;
	readonly isLastSlide = $derived(this.currentSlide === this.totalSlides - 1);
	readonly canGoBack = $derived(this.currentSlide > 0);
	readonly canGoForward = $derived(this.currentSlide < this.maxReachedSlide);

	readonly savingsAmount = $derived(
		this.salary ? Math.round((this.salary * this.savingsPercent) / 100) : 0
	);
	readonly budget = $derived(this.salary ? this.salary - this.savingsAmount : 0);

	readonly canProceed = $derived(
		this.currentSlide !== 1 || (this.salary !== null && this.salary > 0)
	);

	/** Start Google OAuth and check if returning user. */
	async login() {
		this.loading = true;
		await authClient.signIn.social({ provider: 'google' });
	}

	/** Called when session is detected (after OAuth return). */
	async checkReturningUser() {
		this.loading = true;
		try {
			const res = await fetch('/api/sync');
			if (!res.ok) {
				this.loading = false;
				this.next();
				return;
			}
			const { exists, data } = await res.json() as { exists: boolean; data?: UserData };
			if (exists && data) {
				saveLocalData(data);
				settingsVM.rehydrate();
				accountsVM.rehydrate();
				expensesVM.rehydrate();
				categoriesVM.rehydrate();
				subscriptionsVM.rehydrate();
				recurringVM.rehydrate();
				startSync();
				setTimeout(() => { this.visible = false; }, 400);
			} else {
				this.loading = false;
				this.next();
			}
		} catch {
			// Offline or error — continue as new user
			this.loading = false;
			this.next();
		}
	}

	next() {
		if (!this.canProceed) return;
		if (this.currentSlide < this.totalSlides - 1) {
			this.direction = 1;
			this.currentSlide++;
			if (this.currentSlide > this.maxReachedSlide) {
				this.maxReachedSlide = this.currentSlide;
			}
		}
	}

	prev() {
		if (!this.canGoBack) return;
		this.direction = -1;
		this.currentSlide--;
	}

	goToSlide(idx: number) {
		if (idx < 0 || idx > this.maxReachedSlide) return;
		this.direction = idx > this.currentSlide ? 1 : -1;
		this.currentSlide = idx;
	}

	skip() {
		this.direction = 1;
		this.maxReachedSlide = this.totalSlides - 1;
		this.currentSlide = this.totalSlides - 1;
	}

	finish() {
		this.#applyAndFinish();
	}

	setSavingsPercent(pct: number) {
		this.savingsPercent = Math.max(0, Math.min(100, Math.round(pct)));
	}

	#applyAndFinish() {
		const sal = this.salary ?? 10000;

		settingsVM.currency = this.currency;
		settingsVM.fiatCurrency = this.fiatViewEnabled ? this.fiatCurrency : this.currency;
		settingsVM.fiatViewEnabled = this.fiatViewEnabled;
		settingsVM.updatePayday(this.payday);
		settingsVM.updateSavingsPercent(this.savingsPercent);

		recurringVM.syncSalary(sal, this.payday, 'pending');

		// Баланс при реєстрації = 0. Зарплату не нараховуємо автоматично —
		// користувач сам заповнює реальні баланси своїх рахунків.
		accountsVM.add({
			name: m.default_account_name(),
			balance: 0,
			currencyCode: this.currency,
			isPrimary: true
		});

		const createdAcc = accountsVM.accounts[accountsVM.accounts.length - 1];
		if (createdAcc) {
			recurringVM.syncSalary(sal, this.payday, createdAcc.id);
		}

		settingsVM.updateLastPayday(new Date().toISOString());
		settingsVM.completeOnboarding();

		syncNow();

		setTimeout(() => {
			this.visible = false;
		}, 400);
	}
}
