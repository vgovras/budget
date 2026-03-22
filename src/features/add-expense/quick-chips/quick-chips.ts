import type { Expense, Category } from '$lib/types.js';

export interface QuickChip {
	icon: string;
	note: string;
	amount: number;
	bg: string;
	border: string;
}

export function getRecentUnique(expenses: Expense[], categories: Category[], limit = 5): QuickChip[] {
	const seen = new Set<string>();
	const result: QuickChip[] = [];
	for (const e of expenses) {
		if (e.type === 'income') continue;
		if (seen.has(e.icon)) continue;
		seen.add(e.icon);
		const cat = categories.find((c) => c.icon === e.icon);
		result.push({
			icon: e.icon,
			note: e.note,
			amount: e.amount,
			bg: cat?.bg ?? '',
			border: cat?.border ?? ''
		});
		if (result.length >= limit) break;
	}
	return result;
}
