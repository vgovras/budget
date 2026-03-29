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
	import SubscriptionList from '$features/subscriptions/subscription-list/subscription-list.svelte';
	import { subscriptionsVM } from '$features/subscriptions/subscriptions.svelte.js';
	import SavingsEditor from '$lib/ui/savings-editor/savings-editor.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { onAddAccount, onEditAccount, onAddSubscription, onEditSubscription }: {
		onAddAccount?: () => void;
		onEditAccount?: (id: string) => void;
		onAddSubscription?: () => void;
		onEditSubscription?: (id: string) => void;
	} = $props();

	const vm = new AnalyticsViewModel();

	const hasSavings = $derived(settingsVM.salary > 0);
	const savingsCurrency = $derived(settingsVM.displayCurrency);

	function setSavingsPercent(pct: number) {
		settingsVM.updateSavingsPercent(pct);
	}
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_analytics()}</span>
</div>

<div class="screen-content" use:scrollNav>
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
			{@const cur = vm.isFiat ? settingsVM.fiatCurrency : acc.currencyCode}
			{#if i > 0}
				<div class="acc-divider"></div>
			{/if}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="acc-row" onclick={() => { accountsVM.setActive(i); onEditAccount?.(acc.id); }}>
				<div class="acc-icon" class:primary={acc.isPrimary}>
					<Icon name={acc.isPrimary ? 'star' : 'wallet'} size={18} />
				</div>
				<div class="acc-info">
					<div class="acc-name">{acc.name}</div>
					{#if acc.budget > 0 && spent > 0}
						<div class="acc-budget-line">{cur} {fmt(settingsVM.toDisplay(spent, acc.currencyCode))} / {cur} {fmt(settingsVM.toDisplay(acc.budget, acc.currencyCode))}</div>
					{/if}
				</div>
				<div class="acc-balance-wrap">
					{#if vm.isFiat && acc.currencyCode !== settingsVM.fiatCurrency}
						<div class="acc-balance">{settingsVM.fiatCurrency} {fmt(convert(acc.balance, acc.currencyCode, settingsVM.fiatCurrency))}</div>
						<div class="acc-balance-original">{acc.currencyCode} {fmt(acc.balance)}</div>
					{:else}
						<div class="acc-balance">{acc.currencyCode} {fmt(acc.balance)}</div>
					{/if}
				</div>
			</div>
			{#if acc.budget > 0 && spent > 0}
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

	<SubscriptionList
		onAdd={() => onAddSubscription?.()}
		onEdit={(id) => onEditSubscription?.(id)}
	/>

	{#if hasSavings}
		<div class="analytics-card">
			<div class="analytics-title">{m.onboarding_savings_pill()}</div>
			<SavingsEditor
				savingsPercent={settingsVM.savingsPercent}
				savingsAmount={settingsVM.toDisplay(settingsVM.savingsAmount, settingsVM.currency)}
				subscriptionsTotal={subscriptionsVM.monthlyTotal}
				budget={settingsVM.toDisplay(settingsVM.budget, settingsVM.currency)}
				currency={savingsCurrency}
				onSetPercent={setSavingsPercent}
			/>
		</div>
	{/if}

</div>

<style>
	.analytics-card {
		background: var(--card);
		border-radius: 20px;
		padding: 20px;
		border: 1px solid var(--border);
		flex-shrink: 0;
	}

	.analytics-title {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: var(--text-lo);
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
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-secondary);
	}
	.acc-divider {
		height: 1px;
		background: var(--surface-4);
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
		background: var(--surface-5);
		border: 1px solid var(--border);
		color: var(--text-mid);
	}
	.acc-icon.primary {
		background: rgba(80, 200, 120, 0.12);
		border-color: rgba(80, 200, 120, 0.25);
		color: rgba(80, 200, 120, 0.8);
	}
	.acc-info {
		flex: 1;
		min-width: 0;
	}
	.acc-name {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-hi);
	}
	.acc-budget-line {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--text-lo);
		margin-top: 2px;
	}
	.acc-balance-wrap {
		flex-shrink: 0;
		text-align: right;
	}
	.acc-balance {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--text-hi);
	}
	.acc-balance-original {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--text-lo);
		margin-top: 2px;
	}
	.acc-prog-track {
		height: 2px;
		border-radius: 99px;
		background: var(--border);
		margin: 0 20px 4px;
	}
	.acc-prog-fill {
		height: 100%;
		border-radius: 99px;
		background: rgba(80, 130, 255, 0.5);
		transition: width 0.8s var(--ease-out);
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
		background: var(--surface-3);
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
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--accent);
	}
</style>
