<script lang="ts">
	import { AnalyticsViewModel } from '../analytics.svelte.js';
	import DonutChart from '../donut-chart/donut-chart.svelte';
	import WeeklyBars from '../weekly-bars/weekly-bars.svelte';
	import CategoryLimits from '../category-limits/category-limits.svelte';
	import { fmt } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	const vm = new AnalyticsViewModel();
</script>

<div class="top-bar">
	<span class="top-bar-title">{m.screen_title_analytics()}</span>
</div>

<div class="content" use:scrollNav>
	{#if vm.dailyBudget > 0}
		<div class="daily-budget-card">
			<div class="daily-budget-emoji"><Icon name="piggy-bank" size={24} /></div>
			<div class="daily-budget-info">
				<div class="daily-budget-label">{m.analytics_daily_budget()}</div>
				<div class="daily-budget-val">₴ {fmt(vm.dailyBudget)}</div>
			</div>
		</div>
	{/if}

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_expenses_by_category()}</div>
		<DonutChart byCategory={vm.byCategory} total={vm.total} />
	</div>

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_expenses_by_week()}</div>
		<WeeklyBars weeklyAmounts={vm.weeklyAmounts} />
	</div>

	<div class="analytics-card">
		<div class="analytics-title">{m.analytics_category_limits()}</div>
		<CategoryLimits />
	</div>
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
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}

	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 12px 16px calc(100px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 14px;
		scrollbar-width: none;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.content::-webkit-scrollbar {
		display: none;
	}

	.analytics-card {
		background: rgba(255, 255, 255, 0.03);
		border-radius: var(--r-xl);
		padding: 20px;
		border: 1px solid rgba(255, 255, 255, 0.06);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
	}

	.analytics-title {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-lo);
		margin-bottom: 16px;
	}

	.daily-budget-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: var(--r-md);
		padding: 14px 16px;
		display: flex;
		align-items: center;
		gap: 12px;
		box-shadow: none;
	}
	.daily-budget-emoji {
		display: flex;
		align-items: center;
	}
	.daily-budget-info {
		flex: 1;
	}
	.daily-budget-label {
		font-size: 11px;
		color: var(--text-lo);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 2px;
	}
	.daily-budget-val {
		font-size: 22px;
		font-weight: 300;
		font-family: var(--font-mono);
		color: var(--text-hi);
		letter-spacing: -0.03em;
	}
</style>
