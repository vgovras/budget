<script lang="ts">
	import type { Expense } from '$lib/types.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let {
		expense,
		onclick,
		isNew = false
	}: { expense: Expense; onclick?: () => void; isNew?: boolean } = $props();
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
	<span class="exp-amount">
		{expense.type === 'income' ? '+' : '−'}₴ {fmt(expense.amount)}
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
		width: 44px;
		height: 44px;
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		position: relative;
		background: rgba(255, 255, 255, 0.05);
		box-shadow: none;
	}

	.exp-info {
		flex: 1;
		min-width: 0;
	}
	.exp-name {
		font-size: 17px;
		font-weight: 500;
		margin-bottom: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text-hi);
	}
	.exp-note {
		font-size: 13px;
		color: var(--text-mid);
		font-family: var(--font-mono);
		letter-spacing: 0.01em;
	}
	.exp-amount {
		font-family: var(--font-mono);
		font-size: 15px;
		font-weight: 500;
		color: var(--text-mid);
		flex-shrink: 0;
		letter-spacing: -0.02em;
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
