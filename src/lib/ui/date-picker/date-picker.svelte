<script lang="ts">
	import { DatePicker, RangeCalendar } from 'bits-ui';
	import { CalendarDate, parseDate } from '@internationalized/date';
	import type { DateRange } from 'bits-ui';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { locale } from '$lib/utils/format.js';

	let {
		value = $bindable(''),
		rangeStart = $bindable(''),
		rangeEnd = $bindable(''),
		mode = 'single'
	}: {
		value?: string;
		rangeStart?: string;
		rangeEnd?: string;
		mode?: 'single' | 'range';
	} = $props();

	function toCD(iso: string): CalendarDate | undefined {
		if (!iso) return undefined;
		try { return parseDate(iso); } catch { return undefined; }
	}

	function fromCD(d: CalendarDate): string {
		return `${d.year}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
	}

	function fmtDate(iso: string): string {
		if (!iso) return '';
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' });
	}

	// Single mode
	let calValue = $state<CalendarDate | undefined>(toCD(value));
	$effect(() => { calValue = toCD(value); });

	function onSingleChange(v: CalendarDate | undefined) {
		if (v) { calValue = v; value = fromCD(v); }
	}

	// Range mode
	let rangeValue = $state<DateRange>({ start: toCD(rangeStart), end: toCD(rangeEnd) });
	$effect(() => { rangeValue = { start: toCD(rangeStart), end: toCD(rangeEnd) }; });

	function onRangeChange(v: DateRange | undefined) {
		if (!v) return;
		rangeValue = v;
		rangeStart = v.start ? fromCD(v.start as CalendarDate) : '';
		rangeEnd = v.end ? fromCD(v.end as CalendarDate) : '';
	}

	const displayText = $derived(() => {
		if (mode === 'range') {
			if (!rangeStart && !rangeEnd) return '';
			if (rangeStart && rangeEnd) return `${fmtDate(rangeStart)} — ${fmtDate(rangeEnd)}`;
			if (rangeStart) return fmtDate(rangeStart);
			return '';
		}
		return fmtDate(value);
	});

	let open = $state(false);
</script>

{#if mode === 'single'}
	<DatePicker.Root
		type="single"
		value={calValue}
		onValueChange={onSingleChange}
		weekdayFormat="short"
		fixedWeeks={true}
		locale={locale()}
	>
		<DatePicker.Input class="hidden" />
		<DatePicker.Trigger
			class="flex items-center justify-between w-full px-4 py-3 rounded-sm border border-surface-8 bg-surface-5 cursor-pointer transition-all duration-200 hover:border-surface-16"
		>
			<span class="text-base {value ? 'text-text-hi' : 'text-text-lo'}">{displayText() || 'Select date'}</span>
			<Icon name="chevron-down" size={16} class="text-text-lo" />
		</DatePicker.Trigger>
		<DatePicker.Content sideOffset={6} class="z-50">
			<DatePicker.Calendar class="bg-card-elevated border border-border rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)]">
				{#snippet children({ months, weekdays })}
					<DatePicker.Header class="flex items-center justify-between gap-1 mb-2">
						<DatePicker.PrevButton class="w-8 h-8 rounded-lg flex items-center justify-center text-text-mid hover:bg-surface-8 transition-all active:scale-95">
							<Icon name="chevron-left" size={16} />
						</DatePicker.PrevButton>
						<div class="flex items-center gap-1.5">
							<DatePicker.MonthSelect class="bg-surface-5 border border-border rounded-lg px-2 py-1 text-sm font-medium text-text-hi cursor-pointer" />
							<DatePicker.YearSelect class="bg-surface-5 border border-border rounded-lg px-2 py-1 text-sm font-medium text-text-hi cursor-pointer" />
						</div>
						<DatePicker.NextButton class="w-8 h-8 rounded-lg flex items-center justify-center text-text-mid hover:bg-surface-8 transition-all active:scale-95">
							<Icon name="chevron-right" size={16} />
						</DatePicker.NextButton>
					</DatePicker.Header>
					{#each months as month (month.value)}
						<DatePicker.Grid class="w-full border-collapse select-none">
							<DatePicker.GridHead>
								<DatePicker.GridRow class="flex w-full">
									{#each weekdays as day (day)}
										<DatePicker.HeadCell class="w-9 h-9 text-center text-xs font-medium text-text-lo flex items-center justify-center">
											{day.slice(0, 2)}
										</DatePicker.HeadCell>
									{/each}
								</DatePicker.GridRow>
							</DatePicker.GridHead>
							<DatePicker.GridBody>
								{#each month.weeks as weekDates (weekDates)}
									<DatePicker.GridRow class="flex w-full">
										{#each weekDates as date (date)}
											<DatePicker.Cell {date} month={month.value} class="!p-0 relative w-9 h-9 text-center text-sm">
												<DatePicker.Day
													class="w-9 h-9 inline-flex items-center justify-center rounded-lg text-sm transition-all
														hover:bg-surface-8
														data-[selected]:bg-accent data-[selected]:text-white data-[selected]:font-medium
														data-[today]:font-bold
														data-[disabled]:text-text-muted data-[disabled]:pointer-events-none
														data-[outside-month]:text-text-muted data-[outside-month]:pointer-events-none"
												/>
											</DatePicker.Cell>
										{/each}
									</DatePicker.GridRow>
								{/each}
							</DatePicker.GridBody>
						</DatePicker.Grid>
					{/each}
				{/snippet}
			</DatePicker.Calendar>
		</DatePicker.Content>
	</DatePicker.Root>
{:else}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="relative">
		<div
			class="flex items-center justify-between w-full px-4 py-3 rounded-sm border border-surface-8 bg-surface-5 cursor-pointer transition-all duration-200 hover:border-surface-16"
			onclick={() => (open = !open)}
		>
			<span class="text-base {displayText() ? 'text-text-hi' : 'text-text-lo'}">{displayText() || 'Select range'}</span>
			<Icon name="chevron-down" size={16} class="text-text-lo" />
		</div>

		{#if open}
			<div class="fixed inset-0 z-40" onclick={() => (open = false)}></div>
			<div class="absolute left-0 top-[calc(100%+6px)] z-50">
				<RangeCalendar.Root
					class="bg-card-elevated border border-border rounded-xl p-3 shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
					weekdayFormat="short"
					fixedWeeks={true}
					locale={locale()}
					value={rangeValue}
					onValueChange={onRangeChange}
				>
					{#snippet children({ months, weekdays })}
						<RangeCalendar.Header class="flex items-center justify-between gap-1 mb-2">
							<RangeCalendar.PrevButton class="w-8 h-8 rounded-lg flex items-center justify-center text-text-mid hover:bg-surface-8 transition-all active:scale-95">
								<Icon name="chevron-left" size={16} />
							</RangeCalendar.PrevButton>
							<RangeCalendar.Heading class="text-sm font-medium text-text-hi" />
							<RangeCalendar.NextButton class="w-8 h-8 rounded-lg flex items-center justify-center text-text-mid hover:bg-surface-8 transition-all active:scale-95">
								<Icon name="chevron-right" size={16} />
							</RangeCalendar.NextButton>
						</RangeCalendar.Header>
						{#each months as month (month.value.month)}
							<RangeCalendar.Grid class="w-full border-collapse select-none">
								<RangeCalendar.GridHead>
									<RangeCalendar.GridRow class="flex w-full">
										{#each weekdays as day (day)}
											<RangeCalendar.HeadCell class="w-9 h-9 text-center text-xs font-medium text-text-lo flex items-center justify-center">
												{day.slice(0, 2)}
											</RangeCalendar.HeadCell>
										{/each}
									</RangeCalendar.GridRow>
								</RangeCalendar.GridHead>
								<RangeCalendar.GridBody>
									{#each month.weeks as weekDates (weekDates)}
										<RangeCalendar.GridRow class="flex w-full">
											{#each weekDates as date (date)}
												<RangeCalendar.Cell
													{date}
													month={month.value}
													class="!p-0 relative w-9 h-9 text-center text-sm
														data-[selected]:bg-accent-bg
														data-[selection-start]:rounded-l-lg
														data-[selection-end]:rounded-r-lg
														data-[highlighted]:bg-accent-bg"
												>
													<RangeCalendar.Day
														class="w-9 h-9 inline-flex items-center justify-center text-sm transition-all relative z-10
															hover:bg-surface-8 hover:rounded-lg
															data-[selected]:text-text-hi
															data-[selection-start]:bg-accent data-[selection-start]:text-white data-[selection-start]:font-medium data-[selection-start]:rounded-lg
															data-[selection-end]:bg-accent data-[selection-end]:text-white data-[selection-end]:font-medium data-[selection-end]:rounded-lg
															data-[today]:font-bold
															data-[disabled]:text-text-muted data-[disabled]:pointer-events-none
															data-[outside-month]:text-text-muted data-[outside-month]:pointer-events-none"
													/>
												</RangeCalendar.Cell>
											{/each}
										</RangeCalendar.GridRow>
									{/each}
								</RangeCalendar.GridBody>
							</RangeCalendar.Grid>
						{/each}
					{/snippet}
				</RangeCalendar.Root>
			</div>
		{/if}
	</div>
{/if}
