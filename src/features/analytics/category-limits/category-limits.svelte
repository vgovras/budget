<script lang="ts">
	import { CategoryLimitsViewModel } from './category-limits.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const vm = new CategoryLimitsViewModel();
</script>

<div class="cat-limits">
	{#each vm.rows as row, i (row.icon)}
		{#if i > 0}
			<div class="divider"></div>
		{/if}
		<div class="cat-limit-row">
			<div class="cat-limit-header">
				<span class="cat-limit-name"><Icon name={row.icon} size={16} /> {row.label}</span>
				<span class="cat-limit-nums">
					₴{fmt(row.spent)}{row.limit ? ` / ₴${fmt(row.limit)}` : ` · ${m.analytics_no_limit()}`}
				</span>
			</div>
			{#if row.limit > 0}
				<div class="cat-limit-track">
					<div class="cat-limit-fill" style="width:{row.pct}%;background:{row.color}"></div>
				</div>
			{/if}
		</div>
	{/each}
</div>

<style>
	.cat-limits {
		overflow: hidden;
	}

	.divider {
		height: 1px;
		background: var(--border);
		margin: 0 16px;
	}

	.cat-limit-row {
		padding: 12px 16px;
	}
	.cat-limit-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}
	.cat-limit-name {
		font-size: 14px;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.cat-limit-nums {
		font-size: 12px;
		font-family: var(--font-mono);
		color: var(--text-lo);
	}
	.cat-limit-track {
		height: 4px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.06);
		overflow: hidden;
	}
	.cat-limit-fill {
		height: 100%;
		border-radius: 99px;
		transition: width 0.6s var(--ease-out);
	}
</style>
