<script lang="ts">
	import ExpenseRow from '../expense-row/expense-row.svelte';
	import { ExpenseListViewModel } from './expense-list.svelte.js';
	import { getDateLabel } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit }: { onEdit?: (id: number) => void } = $props();

	const vm = new ExpenseListViewModel();
</script>

{#if vm.isEmpty}
	<div class="py-2 px-0.5 text-sm text-text-lo">{m.expenses_empty()}</div>
{:else}
	{#each Object.entries(vm.grouped) as [dateKey, items] (dateKey)}
		<div class="bg-card rounded-md border border-border">
			<div class="text-xs font-medium text-text-muted tracking-[1.4px] uppercase px-4 pt-4 pb-2">{getDateLabel(dateKey)}</div>
			{#each items as expense, i (expense.id)}
				{#if i > 0}
					<div class="h-px bg-surface-4 mx-4"></div>
				{/if}
				<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
			{/each}
		</div>
	{/each}
{/if}
