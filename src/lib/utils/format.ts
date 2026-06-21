import type { Expense } from '$lib/types.js';
import { getLocale } from '$lib/paraglide/runtime.js';
import * as m from '$lib/paraglide/messages.js';

const LOCALE_MAP: Record<string, string> = { en: 'en-US', uk: 'uk-UA' };

export function locale(): string {
	return LOCALE_MAP[getLocale()] ?? getLocale();
}

export function fmt(n: number): string {
	return n.toLocaleString(locale());
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
	return d.toLocaleDateString(locale(), { day: 'numeric', month: 'long' });
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

export function fmtMoney(amount: number, currency: string): string {
	return `${currency} ${fmt(amount)}`;
}

/** Compact money: 1.1M, 81.4k, 999 — strips trailing .0 */
export function fmtCompact(amount: number, currency = ''): string {
	const sign = amount < 0 ? '-' : '';
	const abs = Math.abs(amount);
	let value: string;
	let suffix = '';
	if (abs >= 1_000_000) {
		value = (abs / 1_000_000).toFixed(1);
		suffix = 'M';
	} else if (abs >= 1000) {
		value = (abs / 1000).toFixed(1);
		suffix = 'k';
	} else {
		value = String(Math.round(abs));
	}
	value = value.replace(/\.0$/, '');
	return `${currency}${sign}${value}${suffix}`;
}

export function nowISO(): string {
	return new Date().toISOString();
}

export function isoToDateInput(iso: string): string {
	const d = new Date(iso);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function dateInputToISO(dateStr: string): string {
	return new Date(dateStr + 'T12:00:00').toISOString();
}

export function getDateLabel(key: string): string {
	if (key === 'today') return m.date_today();
	if (key === 'yesterday') return m.date_yesterday();
	return key;
}
