<script lang="ts">
	import type { Expense } from '$lib/types.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { categoriesVM } from '$features/categories/categories.svelte.js';

	let {
		expense,
		onclick,
		isNew = false
	}: { expense: Expense; onclick?: () => void; isNew?: boolean } = $props();

	const nativeCurrency = $derived(
		accountsVM.accounts.find((a) => a.id === expense.accountId)?.currencyCode ?? settingsVM.currency
	);
	const currency = $derived(
		settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : nativeCurrency
	);
	const displayAmount = $derived(
		expense.displayAmount && settingsVM.fiatViewEnabled && expense.displayCurrency === settingsVM.fiatCurrency
			? expense.displayAmount
			: settingsVM.toDisplay(expense.amount, nativeCurrency)
	);
	const cat = $derived(categoriesVM.categories.find((c) => c.icon === expense.icon));
	const commissionAmount = $derived(
		expense.commission ? Math.round(displayAmount * expense.commission / 100) : 0
	);
	const shownAmount = $derived(
		expense.commission ? displayAmount - commissionAmount : displayAmount
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="exp-row" class:new-entry={isNew} {onclick}>
	<div class="exp-icon" style:background={cat?.bg || ''} style:border-color={cat?.border || ''}>
		<Icon name={expense.icon} size={20} />
	</div>
	<div class="exp-info">
		<div class="exp-name">{expense.label}</div>
		{#if expense.note}
			<div class="exp-note">{expense.note}</div>
		{/if}
	</div>
	<div class="exp-amount-wrap">
		<span class="exp-amount" class:income={expense.type === 'income'} class:transfer={expense.type === 'transfer'}>
			{expense.type === 'income' ? '+' : expense.type === 'transfer' ? '↔' : '−'}{currency} {fmt(shownAmount)}
		</span>
		{#if expense.commission}
			<span class="exp-commission">−{expense.commission}% ({currency} {fmt(commissionAmount)})</span>
		{/if}
	</div>
</div>

<style>
	.exp-row {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 16px;
		cursor: pointer;
		transition: background 0.15s ease;
		contain: layout style;
	}
	.exp-row:hover {
		background: var(--surface-3);
	}

	.exp-icon {
		width: 38px;
		height: 38px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
		background: var(--surface-5);
		border: 1px solid var(--border);
		color: var(--text-mid);
	}

	.exp-info {
		flex: 1;
		min-width: 0;
	}
	.exp-name {
		font-size: 0.9375rem;
		font-weight: 500;
		margin-bottom: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text-hi);
	}
	.exp-note {
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--text-lo);
	}
	.exp-amount-wrap {
		flex-shrink: 0;
		text-align: right;
	}
	.exp-amount {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--danger);
	}
	.exp-commission {
		font-size: 0.6875rem;
		font-weight: 400;
		color: var(--text-lo);
		display: block;
		margin-top: 2px;
	}
	.exp-amount.income {
		color: var(--income);
	}
	.exp-amount.transfer {
		color: var(--accent);
	}


	.new-entry {
		animation: new-entry 0.5s var(--ease-spring) both;
	}

	@keyframes new-entry {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
</style>
