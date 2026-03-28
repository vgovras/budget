<script lang="ts">
	import type { QuickChip } from './quick-chips.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let { chips, currency = '₴', onSelect }: { chips: QuickChip[]; currency?: string; onSelect: (chip: QuickChip) => void } = $props();
</script>

{#if chips.length > 0}
	<div class="quick-repeat">
		{#each chips as chip (chip.id)}
			<button class="quick-chip" onclick={() => onSelect(chip)}>
				<span class="quick-chip-emoji"><Icon name={chip.icon} size={14} /></span>
				<span class="quick-chip-note">{chip.note}</span>
				<span class="quick-chip-amt">{currency}{chip.amount}</span>
			</button>
		{/each}
	</div>
{/if}

<style>
	.quick-repeat {
		display: flex;
		gap: 8px;
	}

	.quick-chip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		border-radius: 10px;
		border: 1px solid var(--surface-5);
		background: var(--surface-3);
		cursor: pointer;
		transition: all 0.15s ease;
		font-size: 11px;
		color: var(--text-mid);
		font-family: var(--font);
	}

	.quick-chip:hover {
		background: var(--border);
	}

	.quick-chip-emoji {
		display: flex;
		align-items: center;
	}

	.quick-chip-note {
		font-size: 11px;
		color: var(--text-mid);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		text-align: center;
	}

	.quick-chip-amt {
		font-size: 12px;
		font-family: var(--font-mono);
		color: var(--text-mid);
	}
</style>
