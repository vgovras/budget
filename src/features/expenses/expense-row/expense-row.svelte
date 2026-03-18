<script lang="ts">
	import type { Expense } from '$lib/types.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';

	let {
		expense,
		onclick,
		isNew = false
	}: { expense: Expense; onclick?: () => void; isNew?: boolean } = $props();

	const currency = $derived(
		accountsVM.accounts.find((a) => a.id === expense.accountId)?.currency ?? settingsVM.currency
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="exp-row" class:new-entry={isNew} {onclick}>
	<div class="exp-icon">
		<Icon name={expense.icon} size={20} />
	</div>
	<div class="exp-info">
		<div class="exp-name">{expense.label}</div>
		{#if expense.note}
			<div class="exp-note">{expense.note}</div>
		{/if}
	</div>
	<span class="exp-amount" class:income={expense.type === 'income'} class:transfer={expense.type === 'transfer'}>
		{expense.type === 'income' ? '+' : expense.type === 'transfer' ? '↔' : '−'}{currency} {fmt(expense.amount)}
	</span>
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
		background: rgba(255, 255, 255, 0.03);
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
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.45);
	}

	.exp-info {
		flex: 1;
		min-width: 0;
	}
	.exp-name {
		font-size: 15px;
		font-weight: 500;
		margin-bottom: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: rgba(255, 255, 255, 0.85);
	}
	.exp-note {
		font-size: 13px;
		font-weight: 300;
		color: rgba(255, 255, 255, 0.25);
	}
	.exp-amount {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 100, 100, 0.75);
		flex-shrink: 0;
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
