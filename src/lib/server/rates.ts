import { eq } from 'drizzle-orm';
import { db } from './db';
import { exchangeRates } from './schema';
import { log } from './logger';

const BASE = 'usd';
const UPDATE_IN_MS = 24 * 60 * 60 * 1000; // refresh once per day

const sources = (base: string) => [
	`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`,
	`https://latest.currency-api.pages.dev/v1/currencies/${base}.json`
];

type RatesRow = typeof exchangeRates.$inferSelect;

/** Fetch latest rates, trying the primary CDN then the fallback. */
async function fetchFromApi(base: string): Promise<Record<string, number>> {
	for (const url of sources(base)) {
		try {
			const res = await fetch(url);
			if (!res.ok) continue;
			const json = await res.json();
			return json[base] as Record<string, number>;
		} catch {
			/* try next source */
		}
	}
	throw new Error('all rate sources failed');
}

/** Return cached rates, refreshing from the API when the cache is older than its stored TTL. */
export async function getRates(): Promise<{ base: string; rates: Record<string, number> }> {
	const [row] = await db.select().from(exchangeRates).where(eq(exchangeRates.base, BASE));
	const fresh = row && new Date(row.createdAt).getTime() + row.updateInMs > Date.now();
	if (fresh) return { base: BASE, rates: row.rates };
	return refreshRates(row);
}

async function refreshRates(stale?: RatesRow): Promise<{ base: string; rates: Record<string, number> }> {
	try {
		const rates = await fetchFromApi(BASE);
		const now = new Date();
		await db
			.insert(exchangeRates)
			.values({ base: BASE, rates, updateInMs: UPDATE_IN_MS, createdAt: now })
			.onConflictDoUpdate({
				target: exchangeRates.base,
				set: { rates, updateInMs: UPDATE_IN_MS, createdAt: now }
			});
		log.info('rates refreshed', { count: Object.keys(rates).length });
		return { base: BASE, rates };
	} catch (e) {
		log.error('rates refresh failed', { error: (e as Error).message });
		if (stale) return { base: BASE, rates: stale.rates };
		throw e;
	}
}
