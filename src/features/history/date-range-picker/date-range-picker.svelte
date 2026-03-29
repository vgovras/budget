<script lang="ts">
	import type { DateRangePickerViewModel } from './date-range-picker.svelte.js';
	import Button from '$lib/ui/button/button.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		vm,
		onApply,
		onReset
	}: {
		vm: DateRangePickerViewModel;
		onApply: (from: Date, to: Date) => void;
		onReset: () => void;
	} = $props();
</script>

<div class="picker">
	{#if vm.hintText}
		<div class="hint">{vm.hintText}</div>
	{/if}

	<div class="month-header">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span class="nav-arrow" onclick={() => vm.prevMonth()}>
			<Icon name="chevron-left" size={18} />
		</span>
		<span class="month-label">{vm.monthLabel}</span>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<span class="nav-arrow" onclick={() => vm.nextMonth()}>
			<Icon name="chevron-right" size={18} />
		</span>
	</div>

	<div class="weekdays">
		{#each vm.weekDays as wd}
			<span class="wd">{wd}</span>
		{/each}
	</div>

	<div class="days-grid">
		{#each vm.daysGrid as cell}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<span
				class="day"
				class:outside={!cell.isCurrentMonth}
				class:today={cell.isToday}
				class:in-range={vm.isInRange(cell.date)}
				class:range-start={vm.isRangeStart(cell.date)}
				class:range-end={vm.isRangeEnd(cell.date)}
				onclick={() => vm.selectDate(cell.date)}
			>
				{cell.day}
			</span>
		{/each}
	</div>

	<div class="actions">
		<Button variant="ghost" size="sm" onclick={() => { vm.reset(); onReset(); }}>
			{m.calendar_reset()}
		</Button>
		<Button variant="accent" size="sm" disabled={!vm.canApply} onclick={() => onApply(vm.rangeStart!, vm.rangeEnd!)}>
			{m.calendar_apply()}
		</Button>
	</div>
</div>

<style>
	.picker {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.hint {
		font-size: 0.6875rem;
		color: var(--accent);
		text-align: center;
		font-weight: 500;
		letter-spacing: 0.5px;
	}

	.month-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 4px;
	}
	.month-label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--text-hi);
		text-transform: capitalize;
	}
	.nav-arrow {
		cursor: pointer;
		color: var(--text-mid);
		padding: 4px;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.15s;
	}
	.nav-arrow:hover {
		color: var(--text-primary);
	}

	.weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
	}
	.wd {
		font-size: 0.6875rem;
		font-weight: 500;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 4px 0;
	}

	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}

	.day {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.8125rem;
		font-weight: 400;
		color: var(--text-primary);
		height: 36px;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.12s ease;
		user-select: none;
	}
	.day:hover {
		background: var(--surface-5);
	}
	.day.outside {
		color: var(--surface-16);
	}
	.day.today {
		color: var(--accent);
		font-weight: 600;
	}
	.day.in-range {
		background: rgba(80, 130, 255, 0.08);
		border-radius: 0;
	}
	.day.range-start {
		background: rgba(80, 130, 255, 0.2);
		color: rgba(80, 130, 255, 1);
		font-weight: 600;
		border-radius: 8px 0 0 8px;
	}
	.day.range-end {
		background: rgba(80, 130, 255, 0.2);
		color: rgba(80, 130, 255, 1);
		font-weight: 600;
		border-radius: 0 8px 8px 0;
	}
	.day.range-start.range-end {
		border-radius: 8px;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 8px;
		padding-top: 4px;
	}
</style>
