import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';

const SAVINGS_STEPS = [0, 10, 30, 50, 65, 75];
const MAX_STEP = SAVINGS_STEPS[SAVINGS_STEPS.length - 1];

export class EditAccountSheetViewModel {
	isOpen = $state(false);
	accountId = $state('');
	name = $state('');
	balance = $state<number | null>(null);
	budget = $state<number | null>(null);
	goalAmount = $state<number | null>(null);

	readonly account = $derived(accountsVM.accounts.find((a) => a.id === this.accountId));
	readonly isMain = $derived(this.account?.type === 'main');
	readonly canSave = $derived(this.name.trim().length > 0);

	readonly currentSavingsPercent = $derived(
		settingsVM.salary > 0 && this.budget !== null
			? Math.round(((settingsVM.salary - this.budget) / settingsVM.salary) * 100)
			: 0
	);

	readonly sliderPosition = $derived.by(() => {
		const pct = this.currentSavingsPercent;
		if (pct <= 0) return 0;
		if (pct >= MAX_STEP) return 100;

		for (let i = 0; i < SAVINGS_STEPS.length - 1; i++) {
			if (pct >= SAVINGS_STEPS[i] && pct <= SAVINGS_STEPS[i + 1]) {
				const range = SAVINGS_STEPS[i + 1] - SAVINGS_STEPS[i];
				const offset = pct - SAVINGS_STEPS[i];
				const segmentSize = 100 / (SAVINGS_STEPS.length - 1);
				return (i + offset / range) * segmentSize;
			}
		}
		return 100;
	});

	readonly displaySteps = $derived.by(() => {
		const pct = this.currentSavingsPercent;
		const segmentSize = 100 / (SAVINGS_STEPS.length - 1);
		const steps = SAVINGS_STEPS.map((s, i) => ({
			pct: s,
			pos: i * segmentSize,
			label: `${s}%`
		}));

		if (pct > MAX_STEP) {
			steps[steps.length - 1] = {
				pct,
				pos: 100,
				label: `${pct}%`
			};
		}
		return steps;
	});

	open(id: string) {
		const acc = accountsVM.accounts.find((a) => a.id === id);
		if (!acc) return;
		this.accountId = id;
		this.name = acc.name;
		this.balance = acc.balance;
		this.budget = acc.budget;
		this.goalAmount = acc.goalAmount ?? null;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	setSavingsIdx(idx: number) {
		const steps = this.displaySteps;
		if (idx >= steps.length) return;
		const pct = SAVINGS_STEPS[idx] ?? MAX_STEP;
		const salary = settingsVM.salary;
		if (salary > 0) {
			this.budget = Math.round(salary * (1 - pct / 100));
		}
	}

	save() {
		if (!this.canSave) return;
		const bal = this.balance ?? 0;
		const bud = Math.min(this.budget ?? 0, bal);
		accountsVM.update(this.accountId, {
			name: this.name.trim(),
			balance: bal,
			budget: bud,
			savingsPercent: this.isMain ? this.currentSavingsPercent : undefined,
			goalAmount: this.goalAmount ?? undefined
		});
		this.close();
	}

	delete() {
		accountsVM.remove(this.accountId);
		this.close();
	}
}
