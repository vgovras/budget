import type { Expense } from '$lib/types.js';
import * as m from '$lib/paraglide/messages.js';

export function fmt(n: number): string {
	return n.toLocaleString('uk-UA');
}

export function getDateKey(date: string): string {
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yest = new Date(today);
	yest.setDate(yest.getDate() - 1);
	const d = new Date(date);
	const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());

	if (day.getTime() === today.getTime()) return 'today';
	if (day.getTime() === yest.getTime()) return 'yesterday';
	return d.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' });
}

export function groupByDate(list: Expense[]): Record<string, Expense[]> {
	const groups: Record<string, Expense[]> = {};
	for (const e of list) {
		const key = e.date ? getDateKey(e.date) : e.day || 'earlier';
		if (!groups[key]) groups[key] = [];
		groups[key].push(e);
	}
	return groups;
}

export function nowISO(): string {
	return new Date().toISOString();
}

export function getDateLabel(key: string): string {
	if (key === 'today') return m.date_today();
	if (key === 'yesterday') return m.date_yesterday();
	return key;
}
