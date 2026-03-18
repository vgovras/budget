import { accountsVM } from '$features/accounts/accounts.svelte.js';

export class AnalyticsViewModel {
	readonly totalBalance = $derived(
		accountsVM.accounts.reduce((s: number, a) => s + a.balance, 0)
	);

	readonly byAccount = $derived(
		accountsVM.accounts
			.filter((a) => a.balance > 0)
			.map((a) => ({
				icon: a.type === 'savings' ? 'landmark' : a.type === 'card' ? 'credit-card' : a.type === 'cash' ? 'banknote' : 'wallet',
				label: a.name,
				sum: a.balance
			}))
			.sort((a, b) => b.sum - a.sum)
	);
}
