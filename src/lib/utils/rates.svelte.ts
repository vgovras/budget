import { CURRENCY_CODES } from '$lib/constants';

/**
 * Reactive symbol-keyed rates-to-USD map.
 * Seeded with fallback values, hydrated from /api/rates by loadRates().
 */
class RatesStore {
	toUsd = $state<Record<string, number>>({ '$': 1, '₴': 0.0241, '€': 1.089, '£': 1.272, 'zł': 0.253 });
	loaded = $state(false);
}

export const ratesStore = new RatesStore();

export async function loadRates() {
	try {
		const res = await fetch('/api/rates');
		if (!res.ok) return;
		const { rates } = (await res.json()) as { rates: Record<string, number> };
		const map: Record<string, number> = { '$': 1 };
		for (const [symbol, code] of Object.entries(CURRENCY_CODES)) {
			const r = rates[code.toLowerCase()]; // 1 USD = r units of `code`
			if (r) map[symbol] = 1 / r; // → 1 unit = 1/r USD
		}
		ratesStore.toUsd = map;
		ratesStore.loaded = true;
	} catch {
		/* keep fallback rates */
	}
}
