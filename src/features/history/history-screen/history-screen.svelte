<script lang="ts">
	import type { Expense } from '$lib/types.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { CATEGORIES } from '$lib/constants.js';
	import { groupByDate, getDateLabel, fmt } from '$lib/utils/format.js';
	import ExpenseRow from '$features/expenses/expense-row/expense-row.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit }: { onEdit?: (id: number) => void } = $props();

	let currentFilter = $state('all');

	const filtered = $derived.by(() => {
		const base = expensesVM.expenses.filter((e: Expense) => e.accountId === accountsVM.active?.id);
		return currentFilter === 'all' ? base : base.filter((e: Expense) => e.icon === currentFilter);
	});

	const grouped = $derived(groupByDate(filtered));
	const total = $derived(filtered.reduce((s: number, e: Expense) => s + e.amount, 0));

	function setFilter(f: string) {
		currentFilter = f;
	}
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_history()}</span>
</div>

<div class="filters">
	<button
		class="filter-pill"
		class:active={currentFilter === 'all'}
		onclick={() => setFilter('all')}
	>
		{m.history_filter_all()}
	</button>
	{#each CATEGORIES as cat (cat.icon)}
		<button
			class="filter-pill"
			class:active={currentFilter === cat.icon}
			onclick={() => setFilter(cat.icon)}
		>
			<Icon name={cat.icon} size={14} />
			{cat.label}
		</button>
	{/each}
</div>

<div class="content" use:scrollNav>
	<div class="month-total">
		<span class="month-total-label">{m.history_total()}</span>
		<span class="month-total-amount">₴ {fmt(total)}</span>
	</div>

	{#each Object.entries(grouped) as [dateKey, items] (dateKey)}
		<div class="card">
			<div class="day-label">{getDateLabel(dateKey)}</div>
			{#each items as expense, i (expense.id)}
				{#if i > 0}
					<div class="exp-divider"></div>
				{/if}
				<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
			{/each}
		</div>
	{/each}
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

	.filters {
		display: flex;
		gap: 8px;
		padding: 0 16px 12px;
		overflow-x: auto;
		scrollbar-width: none;
		flex-shrink: 0;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.filters::-webkit-scrollbar {
		display: none;
	}

	.filter-pill {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 6px 14px;
		border-radius: 99px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: #09090e;
		color: rgba(255, 255, 255, 0.35);
		font-size: 13px;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0;
		transition: all 0.2s ease;
		cursor: pointer;
		font-family: var(--font);
	}
	.filter-pill.active {
		border-color: rgba(80, 130, 255, 0.25);
		background: rgba(80, 130, 255, 0.08);
		color: rgba(80, 130, 255, 0.7);
	}
	.filter-pill:hover:not(.active) {
		border-color: rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.05);
	}

	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 0 16px calc(100px + env(safe-area-inset-bottom));
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

	.month-total {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 2px;
	}
	.month-total-label {
		font-size: 15px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
	}
	.month-total-amount {
		font-family: var(--font-mono);
		font-size: 17px;
		font-weight: 500;
		color: var(--text-mid);
	}

	.card {
		background: #09090e;
		border-radius: 20px;
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.07);
		overflow: visible;
	}

	.day-label {
		font-size: 11px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.2);
		letter-spacing: 1.4px;
		text-transform: uppercase;
		padding: 16px 16px 8px;
	}

	.exp-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.04);
		margin: 0 16px;
	}
</style>
