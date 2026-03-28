import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import { convert } from '$lib/utils/currency.js';

export class AnalyticsViewModel {
	readonly isFiat = $derived(settingsVM.fiatViewEnabled);
	readonly baseCurrency = $derived(this.isFiat ? settingsVM.fiatCurrency : settingsVM.currency);

	readonly showTotal = true;

	#convertBalance(balance: number, currency: string): number {
		return convert(balance, currency, this.baseCurrency);
	}

	readonly totalBalance = $derived(
		accountsVM.accounts.reduce(
			(s: number, a) => s + this.#convertBalance(a.balance, a.currencyCode),
			0
		)
	);

	readonly byAccount = $derived(
		accountsVM.accounts
			.filter((a) => a.balance > 0)
			.map((a) => ({
				icon: 'wallet',
				label: a.name,
				sum: this.#convertBalance(a.balance, a.currencyCode)
			}))
			.sort((a, b) => b.sum - a.sum)
	);
}
