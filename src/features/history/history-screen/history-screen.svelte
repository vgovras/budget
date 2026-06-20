<script lang="ts">
	import { HistoryScreenViewModel } from './history-screen.svelte.js';
	import { categoriesVM } from '$features/categories/categories.svelte.js';
	import { getDateLabel, fmt } from '$lib/utils/format.js';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import DonutChart from '$features/analytics/donut-chart/donut-chart.svelte';
	import ExpenseRow from '$features/expenses/expense-row/expense-row.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import Card from '$lib/ui/card/card.svelte';
	import DatePicker from '$lib/ui/date-picker/date-picker.svelte';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit }: { onEdit?: (id: string) => void } = $props();

	const vm = new HistoryScreenViewModel();

	let rangeStart = $state('');
	let rangeEnd = $state('');

	$effect(() => {
		const from = rangeStart ? new Date(rangeStart + 'T00:00:00') : null;
		const to = rangeEnd ? new Date(rangeEnd + 'T23:59:59') : null;
		vm.setDateRange(from, to);
	});

	const typeOptions = [
		{ value: 'all', label: m.filter_type_all() },
		{ value: 'income', label: m.filter_type_income() },
		{ value: 'expense', label: m.filter_type_expenses() }
	];

	const sortOptions = [
		{ value: 'date', label: m.filter_sort_date() },
		{ value: 'amount-desc', label: m.filter_sort_largest() },
		{ value: 'amount-asc', label: m.filter_sort_smallest() }
	];

</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_history()}</span>
</div>

<div class="search-row">
	<div class="search-bar">
		<Icon name="search" size={16} />
		<input
			class="search-input"
			type="text"
			placeholder={m.history_search_placeholder()}
			bind:value={vm.searchQuery}
		/>
		{#if vm.searchQuery}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span class="search-clear" onclick={() => (vm.searchQuery = '')}>
				<Icon name="x" size={14} />
			</span>
		{/if}
	</div>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="filter-toggle" class:active={vm.filterPanelOpen} onclick={() => vm.toggleFilterPanel()}>
		<Icon name="sliders-horizontal" size={18} />
		{#if vm.hasActiveFilters}
			<span class="filter-dot"></span>
		{/if}
	</div>
</div>

{#if vm.filterPanelOpen}
	<div class="filter-panel" transition:slide={{ duration: 200 }}>
		<div class="filter-row">
			<div class="filter-field">
				<span class="filter-label">{m.filter_label_type()}</span>
				<Dropdown bind:value={vm.transactionType} options={typeOptions} />
			</div>
			<div class="filter-field">
				<span class="filter-label">{m.filter_label_sort()}</span>
				<Dropdown bind:value={vm.sortMode} options={sortOptions} />
			</div>
		</div>

		<div class="filter-field">
			<span class="filter-label">{m.label_date()}</span>
			<DatePicker mode="range" bind:rangeStart bind:rangeEnd />
		</div>
	</div>
{/if}

<div class="filters">
	<button
		class="filter-pill"
		class:active={vm.selectedCategories.size === 0}
		onclick={() => vm.clearCategories()}
	>
		{m.history_filter_all()}
	</button>
	{#each categoriesVM.categories as cat (cat.id)}
		<button
			class="filter-pill"
			class:active={vm.isCategorySelected(cat.icon)}
			style:background={vm.isCategorySelected(cat.icon) ? cat.bg : ''}
			style:border-color={vm.isCategorySelected(cat.icon) ? cat.border : ''}
			onclick={() => vm.toggleCategory(cat.icon)}
		>
			<Icon name={cat.icon} size={14} />
			{cat.label}
		</button>
	{/each}
</div>

<div class="screen-content" use:scrollNav>
	{#if vm.hasData}
		<Card class="card-padding">
			<div class="chart-header">
				<div>
					<div class="chart-label">{m.history_total()}</div>
					<div class="chart-period">{vm.periodLabel}</div>
				</div>
			</div>
			<DonutChart byCategory={vm.byCategory} total={vm.donutTotal} currency={vm.displayCurrency} />
		</Card>
	{/if}

	{#if vm.filtered.length === 0}
		<div class="empty-state">
			<Icon name="search-x" size={32} />
			<span>{m.history_nothing_found()}</span>
		</div>
	{:else if vm.grouped}
		{#each Object.entries(vm.grouped) as [dateKey, items] (dateKey)}
			<div class="card">
				<div class="day-label">{getDateLabel(dateKey)}</div>
				{#each items as expense, i (expense.id)}
					{#if i > 0}<div class="exp-divider"></div>{/if}
					<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
				{/each}
			</div>
		{/each}
	{:else}
		<div class="card">
			{#each vm.filtered as expense, i (expense.id)}
				{#if i > 0}<div class="exp-divider"></div>{/if}
				<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
			{/each}
		</div>
	{/if}
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
		backdrop-filter: blur(20px) saturate(1.2);
		-webkit-backdrop-filter: blur(20px) saturate(1.2);
		background: color-mix(in srgb, var(--bg) 80%, transparent);
	}
	.top-bar-title {
		font-size: 1.25rem;
		font-weight: 500;
		color: var(--text-hi);
	}

	.search-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 16px 8px;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}

	.search-bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 14px;
		border-radius: 14px;
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--text-lo);
		flex: 1;
		min-width: 0;
	}
	.search-input {
		flex: 1;
		background: none;
		border: none;
		outline: none;
		font-size: 0.875rem;
		color: var(--text-hi);
		font-family: var(--font);
		min-width: 0;
	}
	.search-input::placeholder {
		color: var(--text-lo);
	}
	.search-clear {
		cursor: pointer;
		display: flex;
		align-items: center;
		color: var(--text-lo);
	}

	.filter-toggle {
		width: 42px;
		height: 42px;
		border-radius: 14px;
		border: 1px solid var(--border);
		background: var(--card);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--text-mid);
		transition: all 0.2s ease;
		flex-shrink: 0;
		position: relative;
	}
	.filter-toggle.active {
		border-color: var(--accent-border);
		color: var(--accent);
	}
	.filter-dot {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--danger);
	}

	/* Filter panel */
	.filter-panel {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 12px 16px;
		margin: 0 16px 8px;
		max-width: 568px;
		margin-left: auto;
		margin-right: auto;
		width: calc(100% - 32px);
		background: var(--card);
		border: 1px solid var(--border);
		border-radius: 16px;
	}
	.filter-row {
		display: flex;
		gap: 8px;
	}
	.filter-field {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.filter-label {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0.8px;
		text-transform: uppercase;
		color: var(--text-muted);
	}
	/* Category chips */
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
		border: 1px solid var(--border);
		background: var(--card);
		color: var(--text-mid);
		font-size: 0.8125rem;
		font-weight: 500;
		white-space: nowrap;
		flex-shrink: 0;
		transition: all 0.2s ease;
		cursor: pointer;
		font-family: var(--font);
	}
	.filter-pill.active {
		border-color: var(--accent-border);
		background: var(--accent-bg);
		color: var(--accent);
	}

	/* Chart card */
	:global(.card-padding) {
		padding: 18px;
	}
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 16px;
	}
	.chart-label {
		font-size: 0.6875rem;
		letter-spacing: 1.3px;
		text-transform: uppercase;
		color: var(--text-muted);
		font-weight: 500;
	}
	.chart-period {
		font-size: 0.8125rem;
		color: var(--text-primary);
		font-weight: 500;
		margin-top: 2px;
		text-transform: capitalize;
	}
	/* Transaction cards */
	.card {
		background: var(--card);
		border-radius: 20px;
		position: relative;
		border: 1px solid var(--border);
		overflow: visible;
		flex-shrink: 0;
	}
	.day-label {
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-muted);
		letter-spacing: 1.4px;
		text-transform: uppercase;
		padding: 16px 16px 8px;
	}
	.exp-divider {
		height: 1px;
		background: var(--surface-4);
		margin: 0 16px;
	}

	/* Empty state */
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		padding: 48px 20px;
		color: var(--text-muted);
		font-size: 0.875rem;
	}
</style>
