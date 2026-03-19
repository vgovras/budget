import { locale } from '$lib/utils/format.js';
import * as m from '$lib/paraglide/messages.js';

export type SelectionStep = 'start' | 'end' | 'done';

export interface DayCell {
	date: Date;
	day: number;
	isCurrentMonth: boolean;
	isToday: boolean;
}

export class DateRangePickerViewModel {
	displayMonth = $state(new Date().getMonth());
	displayYear = $state(new Date().getFullYear());
	selectionStep = $state<SelectionStep>('start');
	rangeStart = $state<Date | null>(null);
	rangeEnd = $state<Date | null>(null);

	readonly monthLabel = $derived(
		new Date(this.displayYear, this.displayMonth)
			.toLocaleDateString(locale(), { month: 'long', year: 'numeric' })
	);

	readonly hintText = $derived(
		this.selectionStep === 'start'
			? m.calendar_hint_start()
			: this.selectionStep === 'end'
				? m.calendar_hint_end()
				: ''
	);

	readonly canApply = $derived(
		this.rangeStart !== null && this.rangeEnd !== null
	);

	readonly weekDays = $derived.by(() => {
		const base = new Date(2024, 0, 1); // Monday
		const loc = locale();
		return Array.from({ length: 7 }, (_, i) => {
			const d = new Date(base);
			d.setDate(base.getDate() + i);
			return d.toLocaleDateString(loc, { weekday: 'short' }).slice(0, 2);
		});
	});

	readonly daysGrid = $derived.by((): DayCell[] => {
		const year = this.displayYear;
		const month = this.displayMonth;
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		// Monday = 0, Sunday = 6
		let startDow = firstDay.getDay() - 1;
		if (startDow < 0) startDow = 6;

		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const cells: DayCell[] = [];

		// Previous month padding
		for (let i = startDow - 1; i >= 0; i--) {
			const d = new Date(year, month, -i);
			cells.push({ date: d, day: d.getDate(), isCurrentMonth: false, isToday: false });
		}

		// Current month
		for (let d = 1; d <= lastDay.getDate(); d++) {
			const date = new Date(year, month, d);
			cells.push({
				date,
				day: d,
				isCurrentMonth: true,
				isToday: date.getTime() === today.getTime()
			});
		}

		// Next month padding (fill to 42 cells = 6 rows)
		const remaining = 42 - cells.length;
		for (let i = 1; i <= remaining; i++) {
			const d = new Date(year, month + 1, i);
			cells.push({ date: d, day: i, isCurrentMonth: false, isToday: false });
		}

		return cells;
	});

	prevMonth() {
		if (this.displayMonth === 0) {
			this.displayMonth = 11;
			this.displayYear--;
		} else {
			this.displayMonth--;
		}
	}

	nextMonth() {
		if (this.displayMonth === 11) {
			this.displayMonth = 0;
			this.displayYear++;
		} else {
			this.displayMonth++;
		}
	}

	selectDate(date: Date) {
		const d = new Date(date);
		d.setHours(0, 0, 0, 0);

		if (this.selectionStep === 'start' || this.selectionStep === 'done') {
			this.rangeStart = d;
			this.rangeEnd = null;
			this.selectionStep = 'end';
		} else {
			if (d < this.rangeStart!) {
				this.rangeEnd = this.rangeStart;
				this.rangeStart = d;
			} else {
				this.rangeEnd = d;
			}
			this.selectionStep = 'done';
		}
	}

	isInRange(date: Date): boolean {
		if (!this.rangeStart || !this.rangeEnd) return false;
		const t = date.getTime();
		return t > this.rangeStart.getTime() && t < this.rangeEnd.getTime();
	}

	isRangeStart(date: Date): boolean {
		if (!this.rangeStart) return false;
		return date.getTime() === this.rangeStart.getTime();
	}

	isRangeEnd(date: Date): boolean {
		if (!this.rangeEnd) return false;
		return date.getTime() === this.rangeEnd.getTime();
	}

	reset() {
		this.rangeStart = null;
		this.rangeEnd = null;
		this.selectionStep = 'start';
	}
}
