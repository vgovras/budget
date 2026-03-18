import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { convert } from '$lib/utils/currency.js';

export class AnalyticsViewModel {
	readonly isFiat = $derived(settingsVM.fiatViewEnabled);
	readonly baseCurrency = $derived(this.isFiat ? settingsVM.fiatCurrency : settingsVM.currency);

	readonly allSameCurrency = $derived(
		accountsVM.accounts.every((a) => a.currency === this.baseCurrency)
	);

	readonly showTotal = $derived(this.isFiat || this.allSameCurrency);

	#convertBalance(balance: number, currency: string): number {
		return this.isFiat
			? convert(balance, currency, settingsVM.fiatCurrency)
			: balance;
	}

	readonly totalBalance = $derived(
		accountsVM.accounts.reduce(
			(s: number, a) => s + this.#convertBalance(a.balance, a.currency),
			0
		)
	);

	readonly byAccount = $derived(
		accountsVM.accounts
			.filter((a) => a.balance > 0)
			.map((a) => ({
				icon: a.type === 'savings' ? 'landmark' : a.type === 'card' ? 'credit-card' : a.type === 'cash' ? 'banknote' : 'wallet',
				label: a.name,
				sum: this.#convertBalance(a.balance, a.currency)
			}))
			.sort((a, b) => b.sum - a.sum)
	);
}
