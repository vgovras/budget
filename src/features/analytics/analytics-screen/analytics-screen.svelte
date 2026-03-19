<script lang="ts">
	import { AnalyticsViewModel } from '../analytics.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { getAccStats } from '$lib/utils/budget.js';
	import DonutChart from '../donut-chart/donut-chart.svelte';
	import { fmt } from '$lib/utils/format.js';
	import { convert } from '$lib/utils/currency.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onAddAccount, onEditAccount }: { onAddAccount?: () => void; onEditAccount?: (id: string) => void } = $props();

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
	{#if vm.byAccount.length > 0}
		<div class="analytics-card">
			<div class="analytics-title">{m.analytics_balance_distribution()}</div>
			<DonutChart byCategory={vm.byAccount} total={vm.totalBalance} currency={vm.baseCurrency} />
		</div>
	{/if}

	<div class="analytics-card accounts-card">
		<div class="accounts-header">
			<span class="analytics-title" style="margin-bottom:0">{m.analytics_my_accounts()}</span>
			{#if vm.showTotal}
				<span class="accounts-total">{vm.baseCurrency} {fmt(vm.totalBalance)}</span>
			{/if}
		</div>
		{#each accountsVM.accounts as acc, i (acc.id)}
			{@const spent = getAccStats(expensesVM.expenses, acc.id)}
			{@const pct = acc.budget > 0 ? Math.min(Math.round((spent / acc.budget) * 100), 100) : 0}
			{@const goalPct = acc.goalAmount && acc.goalAmount > 0 ? Math.min(Math.round((acc.balance / acc.goalAmount) * 100), 100) : 0}
			{@const cur = vm.isFiat ? settingsVM.fiatCurrency : acc.currency}
			{#if i > 0}
				<div class="acc-divider"></div>
			{/if}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="acc-row" onclick={() => onEditAccount?.(acc.id)}>
				<div class="acc-icon">
					<Icon name={typeIcon[acc.type] ?? 'wallet'} size={18} />
				</div>
				<div class="acc-info">
					<div class="acc-name">{acc.name}</div>
					{#if acc.goalAmount && acc.goalAmount > 0}
						<div class="acc-budget-line">{cur} {fmt(settingsVM.toDisplay(acc.balance, acc.currency))} / {cur} {fmt(settingsVM.toDisplay(acc.goalAmount, acc.currency))} ({goalPct}%)</div>
					{:else if acc.budget > 0 && spent > 0}
						<div class="acc-budget-line">{cur} {fmt(settingsVM.toDisplay(spent, acc.currency))} / {cur} {fmt(settingsVM.toDisplay(acc.budget, acc.currency))}</div>
					{/if}
				</div>
				<div class="acc-balance-wrap">
					{#if vm.isFiat && acc.currency !== settingsVM.fiatCurrency}
						<div class="acc-balance">{settingsVM.fiatCurrency} {fmt(convert(acc.balance, acc.currency, settingsVM.fiatCurrency))}</div>
						<div class="acc-balance-original">{acc.currency} {fmt(acc.balance)}</div>
					{:else}
						<div class="acc-balance">{acc.currency} {fmt(acc.balance)}</div>
					{/if}
				</div>
			</div>
			{#if acc.goalAmount && acc.goalAmount > 0}
				<div class="acc-prog-track">
					<div class="acc-prog-fill goal-fill" style="width:{goalPct}%"></div>
				</div>
			{:else if acc.budget > 0 && spent > 0}
				<div class="acc-prog-track">
					<div class="acc-prog-fill" style="width:{pct}%"></div>
				</div>
			{/if}
		{/each}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="add-acc-row" onclick={() => onAddAccount?.()}>
			<div class="add-acc-icon">
				<Icon name="plus" size={16} />
			</div>
			<span class="add-acc-label">{m.button_add_account()}</span>
		</div>
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
	.acc-balance-wrap {
		flex-shrink: 0;
		text-align: right;
	}
	.acc-balance {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
	}
	.acc-balance-original {
		font-size: 12px;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.25);
		margin-top: 2px;
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
	.acc-prog-fill.goal-fill {
		background: var(--income-dim);
	}

	.add-acc-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 14px 20px;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.add-acc-row:hover {
		background: rgba(255, 255, 255, 0.03);
	}
	.add-acc-icon {
		width: 34px;
		height: 34px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--accent-bg);
		border: 1px solid var(--accent-border);
		color: var(--accent);
	}
	.add-acc-label {
		font-size: 14px;
		font-weight: 500;
		color: var(--accent);
	}
</style>
