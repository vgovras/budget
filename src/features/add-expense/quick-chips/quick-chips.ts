import type { Expense } from '$lib/types.js';

export interface QuickChip {
	icon: string;
	note: string;
	amount: number;
}

export function getRecentUnique(expenses: Expense[], limit = 3): QuickChip[] {
	const seen = new Set<string>();
	const result: QuickChip[] = [];
	for (const e of expenses) {
		if (e.type === 'income') continue;
		const key = `${e.icon}:${e.note}:${e.amount}`;
		if (seen.has(key)) continue;
		seen.add(key);
		result.push({ icon: e.icon, note: e.note, amount: e.amount });
		if (result.length >= limit) break;
	}
	return result;
}
