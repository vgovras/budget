import type { Expense, UserData } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class ExpensesRepository {
	load(): Expense[] {
		const data = getLocalData();
		return Object.values(data.expenses).filter((e) => !e.deleted);
	}

	save(expenses: Expense[]): void {
		const data = getLocalData();
		for (const e of expenses) {
			data.expenses[e.id] = e;
		}
		saveLocalData(data);
	}

	upsert(expense: Expense): void {
		const data = getLocalData();
		data.expenses[expense.id] = expense;
		saveLocalData(data);
	}

	softDelete(id: string): void {
		const data = getLocalData();
		if (data.expenses[id]) {
			data.expenses[id] = { ...data.expenses[id], deleted: true, updatedAt: new Date().toISOString() };
			saveLocalData(data);
		}
	}
}
