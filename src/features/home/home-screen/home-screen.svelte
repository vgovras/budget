<script lang="ts">
	import AccountCarousel from '$features/accounts/account-carousel/account-carousel.svelte';
	import ExpenseList from '$features/expenses/expense-list/expense-list.svelte';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { getDailyBudget } from '$lib/utils/budget.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit, onAddAccount }: { onEdit?: (id: number) => void; onAddAccount?: () => void } =
		$props();

	const hasExpenses = $derived(
		accountsVM.active
			? expensesVM.expenses.some(
					(e) => e.accountId === accountsVM.active!.id && e.type !== 'income'
				)
			: false
	);

	const dailyBudget = $derived(
		accountsVM.active ? getDailyBudget(expensesVM.expenses, accountsVM.active) : 0
	);

	const daysUntilSalary = $derived.by(() => {
		const now = new Date();
		const today = now.getDate();
		const payday = settingsVM.payday || 1;
		if (today <= payday) return payday - today;
		const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
		return daysInMonth - today + payday;
	});
</script>

<div class="content" use:scrollNav>
	<AccountCarousel {onAddAccount} />

	<div class="insights">
		<div class="insight-row">
			<div class="insight-card daily">
				<span class="insight-icon"><Icon name="bar-chart" size={24} /></span>
				<span class="insight-value">{accountsVM.active?.currency ?? '₴'}{fmt(dailyBudget)}</span>
				<span class="insight-label">{m.home_per_day()}</span>
			</div>
			<div class="insight-card days">
				<span class="insight-icon"><Icon name="calendar" size={24} /></span>
				<span class="insight-value">{daysUntilSalary}</span>
				<span class="insight-label"
					>{daysUntilSalary === 0
						? m.home_financial_month_end()
						: m.home_days_until_month_end()}</span
				>
			</div>
		</div>
	</div>

	{#if hasExpenses}
		<div class="section-header">
			<span class="section-label">{m.home_recent_expenses()}</span>
		</div>
		<ExpenseList {onEdit} />
	{:else}
		<div class="insights">
			<div class="empty-prompt">
				<div class="empty-icon">
					<svg viewBox="0 0 48 48" fill="none">
						<circle
							cx="24"
							cy="24"
							r="20"
							stroke="rgba(255,255,255,0.15)"
							stroke-width="1.5"
							stroke-dasharray="4 4"
						/>
						<path
							d="M24 16v16M16 24h16"
							stroke="rgba(255,255,255,0.3)"
							stroke-width="1.5"
							stroke-linecap="round"
						/>
					</svg>
				</div>
				<span class="empty-title">{m.home_no_expenses()}</span>
				<span class="empty-sub"
					>{m.home_no_expenses_hint_before()} <strong>+</strong>
					{m.home_no_expenses_hint_after()}</span
				>
			</div>
		</div>
	{/if}
</div>

<style>
	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 12px 16px calc(100px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 12px;
		scrollbar-width: none;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.content::-webkit-scrollbar {
		display: none;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 2px;
	}
	.section-label {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--text-hi);
	}

	/* --- Insights --- */
	.insights {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-top: 4px;
	}

	.insight-row {
		display: flex;
		gap: 10px;
	}

	.insight-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 20px 12px;
		border-radius: var(--r-lg);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.03);
	}

	.insight-icon {
		display: flex;
		align-items: center;
		margin-bottom: 2px;
	}

	.insight-value {
		font-family: var(--font-mono);
		font-size: 26px;
		font-weight: 400;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}

	.insight-label {
		font-size: 12px;
		color: var(--text-lo);
		letter-spacing: 0.02em;
		text-align: center;
	}

	/* --- Empty prompt --- */
	.empty-prompt {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 36px 20px 24px;
	}

	.empty-icon {
		width: 56px;
		height: 56px;
		margin-bottom: 4px;
		opacity: 0.7;
	}
	.empty-icon svg {
		width: 100%;
		height: 100%;
	}

	.empty-title {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-mid);
	}

	.empty-sub {
		font-size: 14px;
		color: var(--text-lo);
		text-align: center;
		line-height: 1.5;
	}
	.empty-sub :global(strong) {
		color: var(--text-hi);
		font-weight: 600;
	}
</style>
