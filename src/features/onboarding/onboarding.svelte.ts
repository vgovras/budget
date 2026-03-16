import { settingsVM } from '$features/settings/settings.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import * as m from '$lib/paraglide/messages.js';

const SAVINGS_STEPS = [5, 10, 20, 25, 50, 75];

export class OnboardingViewModel {
	currentSlide = $state(0);
	maxReachedSlide = $state(0);
	direction = $state<1 | -1>(1);
	salary = $state<number | null>(null);
	payday = $state(1);
	savingsIdx = $state<number | null>(2); // default 20%
	customSavings = $state<number | null>(null);
	visible = $state(true);

	readonly totalSlides = 5;
	readonly isLastSlide = $derived(this.currentSlide === this.totalSlides - 1);

	readonly savingsSteps = SAVINGS_STEPS;
	readonly savingsPercent = $derived(
		this.savingsIdx !== null ? SAVINGS_STEPS[this.savingsIdx] : null
	);
	readonly savingsAmount = $derived(
		this.customSavings !== null
			? this.customSavings
			: this.salary && this.savingsPercent !== null
				? Math.round((this.salary * this.savingsPercent) / 100)
				: 0
	);
	readonly budget = $derived(
		this.salary ? this.salary - this.savingsAmount : 0
	);

	readonly canProceed = $derived(
		this.currentSlide !== 1 || (this.salary !== null && this.salary > 0)
	);

	readonly canGoBack = $derived(this.currentSlide > 0);
	readonly canGoForward = $derived(
		this.currentSlide < this.maxReachedSlide
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
		if (this.isLastSlide) {
			this.#applyAndFinish();
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

	setSavingsIdx(idx: number) {
		this.savingsIdx = idx;
		this.customSavings = null;
	}

	setCustomSavings(amount: number | null) {
		this.customSavings = amount;
		this.savingsIdx = null;
	}

	#applyAndFinish() {
		const sal = this.salary ?? 0;
		const budget = this.budget > 0 ? this.budget : sal > 0 ? sal : 10000;

		// Prorate budget for remaining days in current month
		const now = new Date();
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		const daysLeft = daysInMonth - now.getDate() + 1;
		const proratedBudget = Math.round(budget * (daysLeft / daysInMonth));

		settingsVM.updateBudget(budget);
		if (sal > 0) settingsVM.updateSalary(sal);
		settingsVM.updatePayday(this.payday);

		accountsVM.add({
			type: 'main',
			name: m.default_account_name(),
			balance: proratedBudget,
			budget: proratedBudget,
			spent: 0,
			currency: settingsVM.currency,
			label: m.account_label_monthly_budget()
		});

		settingsVM.completeOnboarding();

		setTimeout(() => {
			this.visible = false;
		}, 2000);
	}
}
