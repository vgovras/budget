<script lang="ts">
	import { HomeScreenViewModel } from './home-screen.svelte.js';
	import DonutChart from '$features/analytics/donut-chart/donut-chart.svelte';
	import ExpenseRow from '$features/expenses/expense-row/expense-row.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import Card from '$lib/ui/card/card.svelte';
	import WeeklyBars from '$features/analytics/weekly-bars/weekly-bars.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { fmt, getDateLabel } from '$lib/utils/format.js';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import type { QuickChip } from '$features/add-expense/quick-chips/quick-chips.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit, onAdd, onQuickAdd }: { onEdit?: (id: string) => void; onAdd?: () => void; onQuickAdd?: (chip: QuickChip) => void } = $props();

	const vm = new HomeScreenViewModel();
</script>

<div class="screen-content" use:scrollNav>
	<!-- Hero Balance -->
	<div class="hero">
		<div class="flex justify-between items-start">
			<div class="hero-label">{m.account_balance()}</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 bg-surface-5 border border-border text-text-mid cursor-pointer transition-all duration-200 active:scale-90"
				onclick={() => settingsVM.toggleTheme()}
			>
				<Icon name={settingsVM.theme === 'system' ? 'monitor' : settingsVM.theme === 'light' ? 'sun' : 'moon'} size={16} />
			</div>
		</div>
		<div class="hero-balance">
			<span class="curr">{vm.currency}</span>{fmt(vm.accountBalance)}
		</div>
		<div class="hero-sub">
			{#if vm.todaySpent > 0}
				<span class="sub-item spent">–{vm.currency} {fmt(vm.todaySpent)} {m.home_today_spent()}</span>
				<span class="sub-dot"></span>
			{/if}
			<span class="sub-item">{vm.currency} {fmt(vm.dailyBudget)} {m.home_budget_per_day()}</span>
		</div>
	</div>

	<!-- Stat Cards — завжди -->
	<div class="stat-row">
		<Card class="stat-card">
			<div class="stat-icon-row">
				<div class="s-icon"><Icon name="bar-chart" size={13} /></div>
				<div class="stat-badge">{m.home_daily_remaining()}</div>
			</div>
			<div class="stat-val" class:stat-danger={vm.dailyRemaining < 0}>{vm.dailyRemaining < 0 ? '−' : ''}<span class="curr">{vm.currency}</span>{fmt(Math.abs(vm.dailyRemaining))}</div>
			<div class="stat-sub">{m.home_daily_remaining_sub()}</div>
		</Card>
		<Card class="stat-card">
			<div class="stat-icon-row">
				<div class="s-icon"><Icon name="target" size={13} /></div>
				<div class="stat-badge">{m.home_monthly_remaining()}</div>
			</div>
			<div class="stat-val" class:stat-danger={vm.monthlyRemaining < 0}>{vm.monthlyRemaining < 0 ? '−' : ''}<span class="curr">{vm.currency}</span>{fmt(Math.abs(vm.monthlyRemaining))}</div>
			<div class="stat-sub">{m.home_monthly_remaining_sub()}</div>
		</Card>
		<Card class="stat-card">
			<div class="stat-icon-row">
				<div class="s-icon"><Icon name="calendar" size={13} /></div>
				<div class="stat-badge">{m.home_days_until_end_label()}</div>
			</div>
			<div class="stat-val">{vm.daysUntilEnd} <span class="days-unit">{m.home_days_short()}</span></div>
			<div class="stat-sub">{m.home_end_of_month()} {vm.daysEndDate}</div>
		</Card>
	</div>

	<!-- Quick repeat -->
	<Card class="card-padding">
		<div class="card-label" style="margin-bottom:10px">{m.home_quick_repeat()}</div>
		{#if vm.quickChips.length > 0}
			<div class="flex gap-2 overflow-x-auto no-scrollbar">
				{#each vm.quickChips as chip (chip.id)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						class="flex items-center gap-2.5 px-3.5 py-3 rounded-md border border-border bg-surface-3 shrink-0 cursor-pointer transition-all duration-150 active:scale-[0.97] hover:bg-surface-5"
						onclick={() => onQuickAdd?.(chip)}
					>
						<div
							class="w-8 h-8 rounded-[10px] flex items-center justify-center text-text-mid"
							style:background={chip.bg || 'var(--surface-5)'}
							style:border-color={chip.border || 'var(--border)'}
							style:border-width="1px"
							style:border-style="solid"
						>
							<Icon name={chip.icon} size={15} />
						</div>
						<div class="flex flex-col">
							<span class="text-sm text-text-hi font-medium leading-tight">{chip.note}</span>
							<span class="text-xs text-text-lo font-mono">{vm.currency}{fmt(chip.amount)}</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-sm text-text-lo">{m.home_quick_repeat_empty()}</div>
		{/if}
	</Card>

	<!-- Donut -->
	{#if vm.hasExpenses}
		<Card variant="led" class="card-padding">
			<div class="card-top">
				<div>
					<div class="card-label">{m.home_expenses_label()}</div>
					<div class="card-sub">{vm.monthLabel}</div>
				</div>
				<div class="period-toggle">
					<button class="ptab" class:active={vm.activePeriod === 'day'} onclick={() => vm.setPeriod('day')}>{m.home_period_day()}</button>
					<button class="ptab" class:active={vm.activePeriod === 'week'} onclick={() => vm.setPeriod('week')}>{m.home_period_week()}</button>
					<button class="ptab" class:active={vm.activePeriod === 'month'} onclick={() => vm.setPeriod('month')}>{m.home_period_month()}</button>
				</div>
			</div>
			<DonutChart byCategory={vm.byCategory} total={vm.spentAmount} currency={vm.currency} />
		</Card>
	{/if}

	<!-- Weekly Bars — завжди -->
	<Card class="card-padding">
		<div class="card-label" style="margin-bottom:12px">{m.analytics_expenses_by_week()}</div>
		<WeeklyBars weeklyAmounts={vm.weeklyAmounts} />
	</Card>

	<!-- Week history -->
	{#if Object.keys(vm.weekExpenses).length > 0}
		<div>
			<div class="card-label" style="margin-bottom:8px">{m.home_this_week()}</div>
			{#each Object.entries(vm.weekExpenses) as [dateKey, items] (dateKey)}
				<Card class="mb-2">
					<div class="exp-group-label">{getDateLabel(dateKey)}</div>
					{#each items as expense, i (expense.id)}
						{#if i > 0}<div class="exp-divider"></div>{/if}
						<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
					{/each}
				</Card>
			{/each}
		</div>
	{/if}

	<!-- Empty + Tips — внизу якщо немає витрат -->
	{#if !vm.hasExpenses}
		<Card class="empty-card">
			<div class="empty-icon">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-mid">
					<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
				</svg>
			</div>
			<div class="empty-title">{m.home_no_expenses_empty_title()}</div>
			<div class="empty-sub">{m.home_no_expenses_empty_desc()}</div>
			<Button variant="accent" size="sm" class="mt-1 px-5 py-2.5 rounded-xl" onclick={() => onAdd?.()}>+ {m.home_add_first()}</Button>
		</Card>

		<Card class="tips-card">
			<div class="tip-dot"></div>
			<div>
				<div class="tip-label">{m.home_tip_title()}</div>
				<div class="tip-text">{m.home_tip_text()}</div>
			</div>
		</Card>
	{/if}
</div>

<style>
	/* Hero */
	.hero { padding: 0 0.25rem; }
	.hero-label {
		font-size: 0.6875rem; letter-spacing: 1.4px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500; margin-bottom: 0.375rem;
	}
	.hero-balance {
		font-size: 2.75rem; font-weight: 300; color: var(--text-hi);
		letter-spacing: -2px; line-height: 1; margin-bottom: 0.25rem;
	}
	.hero-balance .curr { font-size: 1.375rem; opacity: 0.5; vertical-align: super; letter-spacing: 0; }
	.hero-sub {
		font-size: 0.75rem; color: var(--text-lo); font-weight: 400;
		display: flex; align-items: center; gap: 0.375rem;
	}
	.sub-item { letter-spacing: 0.2px; }
	.sub-item.spent { color: rgba(255,110,110,0.7); }
	.sub-dot {
		width: 3px; height: 3px; border-radius: 50%;
		background: var(--surface-16);
	}

	/* Shared card internals */
	:global(.card-padding) { padding: 1.125rem; }
	.card-top {
		display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;
	}
	.card-label {
		font-size: 0.6875rem; letter-spacing: 1.3px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500;
	}
	.card-sub {
		font-size: 0.8125rem; color: var(--text-primary); font-weight: 500; margin-top: 0.125rem;
	}

	/* Period toggle */
	.period-toggle { display: flex; gap: 0.25rem; }
	.ptab {
		font-size: 0.6875rem; padding: 0.3125rem 0.5rem; border-radius: 0.5rem;
		color: var(--text-lo); cursor: pointer; font-weight: 400;
		background: none; border: none; font-family: var(--font);
	}
	.ptab.active {
		background: var(--border); color: var(--text-primary); font-weight: 500;
	}

	/* Stat cards */
	.stat-row {
		display: flex; gap: 0.5rem;
		overflow-x: auto; scrollbar-width: none;
		min-height: 7.5rem;
	}
	.stat-row::-webkit-scrollbar { display: none; }
	:global(.stat-card) { flex: 1 0 30%; padding: 0.75rem; }
	.stat-icon-row { display: flex; align-items: center; gap: 0.4375rem; margin-bottom: 0.5rem; }
	.s-icon {
		width: 1.75rem; height: 1.75rem; border-radius: 0.5625rem;
		background: var(--surface-5); border: 1px solid var(--border);
		display: flex; align-items: center; justify-content: center;
		color: var(--text-mid);
	}
	.stat-badge {
		font-size: 0.625rem; letter-spacing: 0.8px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500;
	}
	.stat-val { font-size: 1.0625rem; font-weight: 500; color: var(--text-hi); letter-spacing: -0.3px; }
	.stat-val .curr { font-size: 0.75rem; font-weight: 400; opacity: 0.5; }
	.days-unit { font-size: 0.75rem; font-weight: 400; opacity: 0.45; }
	.stat-sub { font-size: 0.6875rem; color: var(--text-muted); font-weight: 400; margin-top: 0.125rem; }
	.stat-danger { color: var(--danger); }

	/* Expense list inside card */
	.exp-group-label {
		font-size: 0.625rem; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
		color: var(--text-muted); padding: 0.75rem 0.875rem 0.4375rem;
	}
	.exp-divider { height: 1px; background: var(--surface-4); margin: 0 0.875rem; }

	/* Empty expenses card */
	:global(.empty-card) {
		display: flex; flex-direction: column; align-items: center;
		gap: 0.625rem; padding: 2rem 1.25rem;
	}
	.empty-icon {
		width: 3.25rem; height: 3.25rem; border-radius: 1.125rem;
		background: var(--surface-4); border: 1px solid var(--surface-8);
		display: flex; align-items: center; justify-content: center;
	}
	.empty-title { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
	.empty-sub {
		font-size: 0.75rem; color: var(--text-lo); font-weight: 400;
		text-align: center; line-height: 1.5; max-width: 12.5rem;
	}

	/* Tips card */
	:global(.tips-card) { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.875rem 1rem; }
	.tip-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: rgba(90,140,255,0.65); flex-shrink: 0; margin-top: 3px;
	}
	.tip-label {
		font-size: 0.625rem; letter-spacing: 1.2px; text-transform: uppercase;
		color: rgba(90,140,255,0.65); font-weight: 500; margin-bottom: 0.25rem;
	}
	.tip-text { font-size: 0.75rem; color: var(--text-secondary); font-weight: 400; line-height: 1.5; }
</style>
