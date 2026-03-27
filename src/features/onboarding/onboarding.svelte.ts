import { settingsVM } from '$features/settings/settings.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { recurringVM } from '$features/recurring/recurring.svelte.js';
import { prorateForCurrentMonth } from '$lib/utils/budget.js';
import * as m from '$lib/paraglide/messages.js';

export class OnboardingViewModel {
	currentSlide = $state(0);
	maxReachedSlide = $state(0);
	direction = $state<1 | -1>(1);
	visible = $state(true);

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

		// Create salary as recurring income
		recurringVM.syncSalary(sal, this.payday, 'pending');

		const budget = this.budget > 0 ? this.budget : sal > 0 ? sal : 10000;
		const { proratedBudget } = prorateForCurrentMonth(budget);

		accountsVM.add({
			type: 'card',
			name: m.default_account_name(),
			balance: sal,
			budget: proratedBudget,
			spent: 0,
			currency: this.currency,
			label: m.account_label_monthly_budget(),
			isPrimary: true
		});

		// Update salary recurring with actual account id
		const createdAcc = accountsVM.accounts[accountsVM.accounts.length - 1];
		if (createdAcc) {
			recurringVM.syncSalary(sal, this.payday, createdAcc.id);
		}

		settingsVM.updateLastPayday(new Date().toISOString());
		settingsVM.completeOnboarding();

		setTimeout(() => {
			this.visible = false;
		}, 400);
	}
}
