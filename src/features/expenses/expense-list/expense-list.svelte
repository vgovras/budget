<script lang="ts">
	import ExpenseRow from '../expense-row/expense-row.svelte';
	import { ExpenseListViewModel } from './expense-list.svelte.js';
	import { getDateLabel } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit }: { onEdit?: (id: number) => void } = $props();

	const vm = new ExpenseListViewModel();
</script>

{#if vm.isEmpty}
	<div class="empty">{m.expenses_empty()}</div>
{:else}
	{#each Object.entries(vm.grouped) as [dateKey, items] (dateKey)}
		<div class="card expenses-card">
			<div class="day-label">{getDateLabel(dateKey)}</div>
			{#each items as expense, i (expense.id)}
				{#if i > 0}
					<div class="exp-divider"></div>
				{/if}
				<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
			{/each}
		</div>
	{/each}
{/if}

<style>
	.empty {
		padding: 8px 2px;
		font-size: 14px;
		color: var(--text-lo);
	}

	.card {
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--r-lg);
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.06);
		overflow: hidden;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.expenses-card {
		overflow: visible;
	}

	.day-label {
		font-size: 12px;
		font-weight: 500;
		color: var(--text-lo);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		padding: 16px 16px 8px;
	}

	.exp-divider {
		height: 1px;
		background: var(--border);
		margin: 0 16px;
	}
</style>
