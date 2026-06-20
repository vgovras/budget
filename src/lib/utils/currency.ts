import { ratesStore } from './rates.svelte';

/**
 * Convert amount between any two currencies.
 * Double conversion: from → USD → to. Rates come from ratesStore (live, with fallback).
 */
export function convert(
	amount: number,
	fromCurrency: string,
	toCurrency: string
): number {
	if (fromCurrency === toCurrency) return amount;
	const rates = ratesStore.toUsd;
	const fromRate = rates[fromCurrency];
	const toRate = rates[toCurrency];
	if (!fromRate || !toRate) return amount;
	return Math.round((amount * fromRate) / toRate);
}

/**
 * Get raw exchange rate between two currencies (no rounding).
 * Returns how many units of `to` currency you get for 1 unit of `from`.
 */
export function getRate(fromCurrency: string, toCurrency: string): number {
	if (fromCurrency === toCurrency) return 1;
	const rates = ratesStore.toUsd;
	const fromRate = rates[fromCurrency];
	const toRate = rates[toCurrency];
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
