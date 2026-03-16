import type { Expense } from '$lib/types.js';

export function getNoteSuggestions(expenses: Expense[], prefix: string): string[] {
	if (!prefix || prefix.length < 1) return [];
	const lp = prefix.toLowerCase();
	const seen = new Set<string>();
	const result: string[] = [];
	for (const e of expenses) {
		if (!e.note) continue;
		const ln = e.note.toLowerCase();
		if (ln.startsWith(lp) && !seen.has(ln) && ln !== lp) {
			seen.add(ln);
			result.push(e.note);
			if (result.length >= 4) break;
		}
	}
	return result;
}
