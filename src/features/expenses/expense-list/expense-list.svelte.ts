import { expensesVM } from '../expenses.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { groupByDate } from '$lib/utils/format.js';

export class ExpenseListViewModel {
	readonly accountExpenses = $derived(
		expensesVM.expenses.filter((e) => e.accountId === accountsVM.active?.id && e.type !== 'income')
	);

	readonly grouped = $derived(groupByDate(this.accountExpenses));

	readonly isEmpty = $derived(this.accountExpenses.length === 0);
}
