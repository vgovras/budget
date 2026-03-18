<script lang="ts">
	import { AnalyticsViewModel } from '../analytics.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { getAccStats } from '$lib/utils/budget.js';
	import DonutChart from '../donut-chart/donut-chart.svelte';
	import WeeklyBars from '../weekly-bars/weekly-bars.svelte';
	import CategoryLimits from '../category-limits/category-limits.svelte';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	const vm = new AnalyticsViewModel();

	const typeIcon: Record<string, string> = {
		savings: 'landmark',
		card: 'credit-card',
		cash: 'banknote'
	};
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_analytics()}</span>
</div>

<div class="content" use:scrollNav>
	<div class="daily-budget-card">
		<div class="daily-budget-emoji"><Icon name="piggy-bank" size={24} /></div>
		<div class="daily-budget-info">
			<div class="daily-budget-label">{m.analytics_daily_budget()}</div>
			<div class="daily-budget-val" class:danger={vm.dailyBudget <= 0}>₴ {fmt(vm.dailyBudget)}</div>
		</div>
	</div>

	<div class="analytics-card accounts-card">
		<div class="accounts-header">
			<span class="analytics-title" style="margin-bottom:0">{m.analytics_my_accounts()}</span>
			<span class="accounts-total">{accountsVM.accounts[0]?.currency ?? '₴'} {fmt(vm.totalBalance)}</span>
		</div>
		{#each accountsVM.accounts as acc, i (acc.id)}
			{@const spent = getAccStats(expensesVM.expenses, acc.id)}
			{@const pct = acc.budget > 0 ? Math.min(Math.round((spent / acc.budget) * 100), 100) : 0}
			{#if i > 0}
				<div class="acc-divider"></div>
			{/if}
			<div class="acc-row">
				<div class="acc-icon">
					<Icon name={typeIcon[acc.type] ?? 'wallet'} size={18} />
				</div>
				<div class="acc-info">
					<div class="acc-name">{acc.name}</div>
					{#if acc.budget > 0}
						<div class="acc-budget-line">{acc.currency} {fmt(spent)} / {acc.currency} {fmt(acc.budget)}</div>
					{/if}
				</div>
				<div class="acc-balance">{acc.currency} {fmt(acc.balance)}</div>
			</div>
			{#if acc.budget > 0}
				<div class="acc-prog-track">
					<div class="acc-prog-fill" style="width:{pct}%"></div>
				</div>
			{/if}
		{/each}
	</div>

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_expenses_by_category()}</div>
		<DonutChart byCategory={vm.byCategory} total={vm.total} />
	</div>

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_expenses_by_week()}</div>
		<WeeklyBars weeklyAmounts={vm.weeklyAmounts} />
	</div>

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_category_limits()}</div>
		<CategoryLimits />
	</div>
</div>

<style>
	.top-bar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 16px 10px;
		flex-shrink: 0;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	.top-bar-title {
		font-size: 20px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
	}

	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 12px 16px calc(100px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 14px;
		scrollbar-width: none;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.content::-webkit-scrollbar {
		display: none;
	}

	.analytics-card {
		background: #09090e;
		border-radius: 20px;
		padding: 20px;
		border: 1px solid rgba(255, 255, 255, 0.07);
	}

	.analytics-title {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		margin-bottom: 16px;
	}

	.daily-budget-card {
		background: #09090e;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		padding: 14px 16px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.daily-budget-emoji {
		display: flex;
		align-items: center;
	}
	.daily-budget-info {
		flex: 1;
	}
	.daily-budget-label {
		font-size: 11px;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.25);
		text-transform: uppercase;
		letter-spacing: 1.4px;
		margin-bottom: 2px;
	}
	.daily-budget-val {
		font-size: 22px;
		font-weight: 300;
		font-family: var(--font-mono);
		color: var(--text-hi);
		letter-spacing: -0.03em;
	}
	.daily-budget-val.danger {
		color: var(--danger);
	}

	/* Accounts card */
	.accounts-card {
		padding: 16px 0;
	}
	.accounts-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20px 12px;
	}
	.accounts-total {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
	}
	.acc-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.04);
		margin: 0 20px;
	}
	.acc-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 20px;
	}
	.acc-icon {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.4);
	}
	.acc-info {
		flex: 1;
		min-width: 0;
	}
	.acc-name {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
	}
	.acc-budget-line {
		font-size: 12px;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.25);
		margin-top: 2px;
	}
	.acc-balance {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
		flex-shrink: 0;
	}
	.acc-prog-track {
		height: 2px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.07);
		margin: 0 20px 4px;
	}
	.acc-prog-fill {
		height: 100%;
		border-radius: 99px;
		background: rgba(80, 130, 255, 0.5);
		transition: width 0.8s var(--ease-out);
	}
</style>
