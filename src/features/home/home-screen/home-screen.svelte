<script lang="ts">
	import { HomeScreenViewModel } from './home-screen.svelte.js';
	import DonutChart from '$features/analytics/donut-chart/donut-chart.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import Card from '$lib/ui/card/card.svelte';
	import WeeklyBars from '$features/analytics/weekly-bars/weekly-bars.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { fmt } from '$lib/utils/format.js';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import type { QuickChip } from '$features/add-expense/quick-chips/quick-chips.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit, onAdd, onQuickAdd }: { onEdit?: (id: number) => void; onAdd?: () => void; onQuickAdd?: (chip: QuickChip) => void } = $props();

	const vm = new HomeScreenViewModel();
</script>

<div class="content" use:scrollNav>
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
				<Icon name={settingsVM.theme === 'dark' ? 'sun' : 'moon'} size={16} />
			</div>
		</div>
		<div class="hero-balance">
			<span class="curr">{vm.currency}</span>{fmt(vm.accountBalance)}
		</div>
		<div class="hero-sub">
			{#if vm.todaySpent > 0}
				<span class="sub-item spent">–{vm.currency} {fmt(vm.todaySpent)} today</span>
				<span class="sub-dot"></span>
			{/if}
			<span class="sub-item">{vm.currency} {fmt(vm.dailyBudget)} / day</span>
		</div>
	</div>

	<!-- Stat Cards — завжди -->
	<div class="stat-row">
		<Card class="stat-card">
			<div class="stat-icon-row">
				<div class="s-icon"><Icon name="bar-chart" size={13} /></div>
				<div class="stat-badge">{m.home_daily_remaining()}</div>
			</div>
			<div class="stat-val" class:stat-danger={vm.dailyRemaining <= 0}><span class="curr">{vm.currency}</span>{fmt(vm.dailyRemaining)}</div>
			<div class="stat-sub">{m.home_daily_remaining_sub()}</div>
		</Card>
		<Card class="stat-card">
			<div class="stat-icon-row">
				<div class="s-icon"><Icon name="target" size={13} /></div>
				<div class="stat-badge">{m.home_monthly_remaining()}</div>
			</div>
			<div class="stat-val" class:stat-danger={vm.monthlyRemaining <= 0}><span class="curr">{vm.currency}</span>{fmt(vm.monthlyRemaining)}</div>
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
				{#each vm.quickChips as chip (chip.note + chip.amount + chip.icon)}
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
			<div class="text-sm text-text-lo font-light">{m.home_quick_repeat_empty()}</div>
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
					<button class="ptab" class:active={vm.activePeriod === 'week'} onclick={() => vm.setPeriod('week')}>{m.home_period_week()}</button>
					<button class="ptab" class:active={vm.activePeriod === 'month'} onclick={() => vm.setPeriod('month')}>{m.home_period_month()}</button>
					<button class="ptab" class:active={vm.activePeriod === 'year'} onclick={() => vm.setPeriod('year')}>{m.home_period_year()}</button>
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
	/* Layout — same pattern as analytics */
	.content {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		padding: 0 16px calc(100px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 14px;
		scrollbar-width: none;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.content::-webkit-scrollbar { display: none; }

	/* Hero */
	.hero { padding: 0 4px; }
	.hero-label {
		font-size: 10px; letter-spacing: 1.4px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500; margin-bottom: 6px;
	}
	.hero-balance {
		font-size: 54px; font-weight: 300; color: var(--text-hi);
		letter-spacing: -3px; line-height: 1; margin-bottom: 5px;
	}
	.hero-balance .curr { font-size: 26px; opacity: 0.35; vertical-align: super; letter-spacing: 0; }
	.hero-sub {
		font-size: 12px; color: var(--text-lo); font-weight: 300;
		display: flex; align-items: center; gap: 6px;
	}
	.sub-item { letter-spacing: 0.2px; }
	.sub-item.spent { color: rgba(255,100,100,0.6); }
	.sub-dot {
		width: 3px; height: 3px; border-radius: 50%;
		background: var(--surface-16);
	}

	/* Shared card internals */
	:global(.card-padding) { padding: 18px; }
	.card-top {
		display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;
	}
	.card-label {
		font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500;
	}
	.card-sub {
		font-size: 13px; color: var(--text-primary); font-weight: 500; margin-top: 2px;
	}

	/* Period toggle */
	.period-toggle { display: flex; gap: 4px; }
	.ptab {
		font-size: 10px; padding: 4px 8px; border-radius: 8px;
		color: var(--text-lo); cursor: pointer; font-weight: 400;
		background: none; border: none; font-family: var(--font);
	}
	.ptab.active {
		background: var(--border); color: var(--text-primary); font-weight: 500;
	}

	/* Stat cards */
	.stat-row { display: flex; gap: 10px; }
	:global(.stat-card) { flex: 1; padding: 13px 12px; }
	.stat-icon-row { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
	.s-icon {
		width: 28px; height: 28px; border-radius: 9px;
		background: var(--surface-5); border: 1px solid var(--border);
		display: flex; align-items: center; justify-content: center;
		color: var(--text-mid);
	}
	.stat-badge {
		font-size: 9px; letter-spacing: 0.8px; text-transform: uppercase;
		color: var(--text-muted); font-weight: 500;
	}
	.stat-val { font-size: 19px; font-weight: 500; color: var(--text-hi); letter-spacing: -0.5px; }
	.stat-val .curr { font-size: 12px; font-weight: 300; opacity: 0.38; }
	.days-unit { font-size: 12px; font-weight: 300; opacity: 0.35; }
	.stat-sub { font-size: 10px; color: var(--text-muted); font-weight: 300; margin-top: 2px; }
	.stat-danger { color: var(--danger); }

	/* Section header */
	.sec-hdr { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
	.sec-title { font-size: 14px; font-weight: 500; color: var(--text-hi); }
	.sec-link { font-size: 12px; color: var(--text-lo); font-weight: 300; cursor: pointer; }

	/* Expense list inside card */
	.exp-group-label {
		font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
		color: var(--text-muted); padding: 12px 14px 7px;
	}
	.exp-divider { height: 1px; background: var(--surface-4); margin: 0 14px; }

	/* Empty expenses card */
	:global(.empty-card) {
		display: flex; flex-direction: column; align-items: center;
		gap: 10px; padding: 32px 20px;
	}
	.empty-icon {
		width: 52px; height: 52px; border-radius: 18px;
		background: var(--surface-4); border: 1px solid var(--surface-8);
		display: flex; align-items: center; justify-content: center;
	}
	.empty-title { font-size: 14px; font-weight: 500; color: var(--text-primary); }
	.empty-sub {
		font-size: 12px; color: var(--text-lo); font-weight: 300;
		text-align: center; line-height: 1.5; max-width: 200px;
	}

	/* Tips card */
	:global(.tips-card) { display: flex; gap: 12px; align-items: flex-start; padding: 14px 16px; }
	.tip-dot {
		width: 6px; height: 6px; border-radius: 50%;
		background: rgba(80,130,255,0.6); flex-shrink: 0; margin-top: 3px;
	}
	.tip-label {
		font-size: 9px; letter-spacing: 1.2px; text-transform: uppercase;
		color: rgba(80,130,255,0.6); font-weight: 500; margin-bottom: 4px;
	}
	.tip-text { font-size: 12px; color: var(--text-secondary); font-weight: 300; line-height: 1.5; }
</style>
