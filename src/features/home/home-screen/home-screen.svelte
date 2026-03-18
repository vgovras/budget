<script lang="ts">
	import { HomeScreenViewModel } from './home-screen.svelte.js';
	import DonutChart from '$features/analytics/donut-chart/donut-chart.svelte';
	import ExpenseRow from '$features/expenses/expense-row/expense-row.svelte';
	import Card from '$lib/ui/card/card.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { navigationVM } from '$features/navigation/navigation.svelte.js';
	import { fmt, getDateLabel } from '$lib/utils/format.js';
	import { scrollNav } from '$lib/utils/scroll-nav.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onEdit, onAdd }: { onEdit?: (id: number) => void; onAdd?: () => void } = $props();

	const vm = new HomeScreenViewModel();
</script>

<div class="top-bar">
	<span class="greeting">{vm.greeting}</span>
</div>

<div class="content" use:scrollNav>
	<!-- Hero Balance -->
	<div class="hero">
		<div class="hero-label">{m.account_balance()}</div>
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

	{#if vm.hasExpenses}
		<!-- Donut Card -->
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
			<DonutChart byCategory={vm.byCategory} total={vm.spentAmount} />
		</Card>

		<!-- Stat Cards -->
		<div class="stat-row">
			<Card class="stat-card">
				<div class="stat-icon-row">
					<div class="s-icon"><Icon name="bar-chart" size={13} /></div>
					<div class="stat-badge">{m.home_daily_limit()}</div>
				</div>
				<div class="stat-val"><span class="curr">{vm.currency}</span>{fmt(vm.dailyBudget)}</div>
				<div class="stat-sub">{m.home_at_current_pace()}</div>
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

		<!-- Recent Expenses -->
		<div class="sec-hdr">
			<span class="sec-title">{m.home_recent_expenses()}</span>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<span class="sec-link" onclick={() => navigationVM.goTo('history')}>{m.home_view_all()} →</span>
		</div>
		<Card>
			{#each Object.entries(vm.recentExpenses) as [dateKey, items] (dateKey)}
				<div class="exp-group-label">{getDateLabel(dateKey)}</div>
				{#each items as expense, i (expense.id)}
					{#if i > 0}<div class="exp-divider"></div>{/if}
					<ExpenseRow {expense} onclick={() => onEdit?.(expense.id)} />
				{/each}
			{/each}
		</Card>
	{:else}
		<!-- Budget Progress Card -->
		<Card variant="led" class="card-padding">
			<div class="card-top">
				<div>
					<div class="card-label">{m.home_spent_label()}</div>
					<div class="card-sub">{vm.monthLabel}</div>
				</div>
			</div>
			<div class="budget-nums">
				<span class="budget-curr">{vm.currency}</span>
				<span class="budget-val">{fmt(vm.spentAmount)}</span>
				<span class="budget-of">{m.account_of()}</span>
				<span class="budget-total">{vm.currency} {fmt(vm.totalBudget)}</span>
			</div>
			<div class="prog-meta">
				<span>{vm.currency} {fmt(vm.spentAmount)} {m.home_spent_label().toLowerCase()}</span>
				<span>{vm.spentPercent}% · {vm.daysUntilEnd} {m.home_days_short()}</span>
			</div>
			<div class="prog-track">
				<div class="prog-fill" style="width:{Math.min(vm.spentPercent, 100)}%">
					{#if vm.spentPercent > 0}<div class="prog-dot"></div>{/if}
				</div>
			</div>
		</Card>

		<!-- Empty Expenses -->
		<div class="sec-hdr">
			<span class="sec-title">{m.home_recent_expenses()}</span>
			<span class="sec-link">{m.home_view_all()} →</span>
		</div>
		<Card class="empty-card">
			<div class="empty-icon">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
					<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
				</svg>
			</div>
			<div class="empty-title">{m.home_no_expenses_empty_title()}</div>
			<div class="empty-sub">{m.home_no_expenses_empty_desc()}</div>
			<button class="empty-btn" onclick={() => onAdd?.()}>+ {m.home_add_first()}</button>
		</Card>

		<!-- Tips -->
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
	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 16px 10px;
		flex-shrink: 0;
		max-width: 600px;
		margin: 0 auto;
		width: 100%;
	}
	.greeting {
		font-size: 15px;
		color: rgba(255, 255, 255, 0.8);
		font-weight: 500;
	}
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
		color: rgba(255,255,255,0.22); font-weight: 500; margin-bottom: 6px;
	}
	.hero-balance {
		font-size: 54px; font-weight: 300; color: #fff;
		letter-spacing: -3px; line-height: 1; margin-bottom: 5px;
	}
	.hero-balance .curr { font-size: 26px; opacity: 0.35; vertical-align: super; letter-spacing: 0; }
	.hero-sub {
		font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 300;
		display: flex; align-items: center; gap: 6px;
	}
	.sub-item { letter-spacing: 0.2px; }
	.sub-item.spent { color: rgba(255,100,100,0.6); }
	.sub-dot {
		width: 3px; height: 3px; border-radius: 50%;
		background: rgba(255,255,255,0.15);
	}

	/* Shared card internals */
	:global(.card-padding) { padding: 18px; }
	.card-top {
		display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;
	}
	.card-label {
		font-size: 10px; letter-spacing: 1.3px; text-transform: uppercase;
		color: rgba(255,255,255,0.22); font-weight: 500;
	}
	.card-sub {
		font-size: 13px; color: rgba(255,255,255,0.7); font-weight: 500; margin-top: 2px;
	}

	/* Period toggle */
	.period-toggle { display: flex; gap: 4px; }
	.ptab {
		font-size: 10px; padding: 4px 8px; border-radius: 8px;
		color: rgba(255,255,255,0.3); cursor: pointer; font-weight: 400;
		background: none; border: none; font-family: var(--font);
	}
	.ptab.active {
		background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.75); font-weight: 500;
	}

	/* Stat cards */
	.stat-row { display: flex; gap: 10px; }
	:global(.stat-card) { flex: 1; padding: 13px 12px; }
	.stat-icon-row { display: flex; align-items: center; gap: 7px; margin-bottom: 8px; }
	.s-icon {
		width: 28px; height: 28px; border-radius: 9px;
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
		display: flex; align-items: center; justify-content: center;
		color: rgba(255,255,255,0.38);
	}
	.stat-badge {
		font-size: 9px; letter-spacing: 0.8px; text-transform: uppercase;
		color: rgba(255,255,255,0.2); font-weight: 500;
	}
	.stat-val { font-size: 19px; font-weight: 500; color: #fff; letter-spacing: -0.5px; }
	.stat-val .curr { font-size: 12px; font-weight: 300; opacity: 0.38; }
	.days-unit { font-size: 12px; font-weight: 300; opacity: 0.35; }
	.stat-sub { font-size: 10px; color: rgba(255,255,255,0.22); font-weight: 300; margin-top: 2px; }

	/* Section header */
	.sec-hdr { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; }
	.sec-title { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); }
	.sec-link { font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 300; cursor: pointer; }

	/* Expense list inside card */
	.exp-group-label {
		font-size: 9px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;
		color: rgba(255,255,255,0.18); padding: 12px 14px 7px;
	}
	.exp-divider { height: 1px; background: rgba(255,255,255,0.04); margin: 0 14px; }

	/* Budget progress (empty state) */
	.budget-nums { display: flex; align-items: baseline; gap: 6px; margin-bottom: 14px; }
	.budget-curr { font-size: 16px; font-weight: 300; opacity: 0.4; color: #fff; }
	.budget-val { font-size: 28px; font-weight: 500; color: #fff; letter-spacing: -1px; }
	.budget-of { font-size: 13px; color: rgba(255,255,255,0.3); font-weight: 300; }
	.budget-total { font-size: 13px; color: rgba(255,255,255,0.5); font-weight: 400; }
	.prog-meta {
		display: flex; justify-content: space-between;
		font-size: 11px; color: rgba(255,255,255,0.22); margin-bottom: 7px;
	}
	.prog-track { width: 100%; height: 3px; background: rgba(255,255,255,0.07); border-radius: 2px; }
	.prog-fill {
		height: 100%; border-radius: 2px; position: relative;
		background: rgba(80,130,255,0.65); transition: width 1s ease;
	}
	.prog-dot {
		position: absolute; right: -4px; top: 50%; transform: translateY(-50%);
		width: 9px; height: 9px; border-radius: 50%;
		background: rgba(120,170,255,0.9); box-shadow: 0 0 6px rgba(100,150,255,0.5);
	}

	/* Empty expenses card */
	:global(.empty-card) {
		display: flex; flex-direction: column; align-items: center;
		gap: 10px; padding: 32px 20px;
	}
	.empty-icon {
		width: 52px; height: 52px; border-radius: 18px;
		background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
		display: flex; align-items: center; justify-content: center;
	}
	.empty-title { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.65); }
	.empty-sub {
		font-size: 12px; color: rgba(255,255,255,0.25); font-weight: 300;
		text-align: center; line-height: 1.5; max-width: 200px;
	}
	.empty-btn {
		margin-top: 4px; padding: 10px 20px; border-radius: 12px;
		border: 1px solid rgba(80,130,255,0.2); cursor: pointer;
		background: rgba(80,130,255,0.12); color: rgba(100,160,255,0.85);
		font-size: 13px; font-weight: 500; font-family: var(--font);
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
	.tip-text { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: 300; line-height: 1.5; }
</style>
