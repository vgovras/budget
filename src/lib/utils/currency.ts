/**
 * Hardcoded exchange rates to USD ($).
 * Key: currency symbol, Value: how many USD per 1 unit.
 * Source: approximate rates as of March 2026.
 */
const RATES_TO_USD: Record<string, number> = {
	'$': 1,
	'₴': 0.0241, // 1₴ ≈ $0.0241 (1$ ≈ 41.5₴)
	'€': 1.089, // 1€ ≈ $1.089
	'£': 1.272, // 1£ ≈ $1.272
	'zł': 0.253 // 1zł ≈ $0.253
};

/**
 * Convert amount between any two currencies.
 * Double conversion: from → USD → to
 */
export function convert(
	amount: number,
	fromCurrency: string,
	toCurrency: string
): number {
	if (fromCurrency === toCurrency) return amount;
	const fromRate = RATES_TO_USD[fromCurrency];
	const toRate = RATES_TO_USD[toCurrency];
	if (!fromRate || !toRate) return amount;
	return Math.round((amount * fromRate) / toRate);
}

/**
 * Get raw exchange rate between two currencies (no rounding).
 * Returns how many units of `to` currency you get for 1 unit of `from`.
 */
export function getRate(fromCurrency: string, toCurrency: string): number {
	if (fromCurrency === toCurrency) return 1;
	const fromRate = RATES_TO_USD[fromCurrency];
	const toRate = RATES_TO_USD[toCurrency];
	if (!fromRate || !toRate) return 1;
	return fromRate / toRate;
}

/**
 * Get unique currencies used across accounts, excluding the base currency.
 */
export function getForeignCurrencies(
	accountCurrencies: string[],
	baseCurrency: string
): string[] {
	return [...new Set(accountCurrencies.filter((c) => c !== baseCurrency))];
}
