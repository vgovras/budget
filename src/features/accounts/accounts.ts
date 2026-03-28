import type { Account } from '$lib/types.js';
import { getLocalData, saveLocalData } from '$lib/utils/store.js';

export class AccountsRepository {
	load(): Account[] {
		const data = getLocalData();
		return Object.values(data.accounts).filter((a) => !a.deleted);
	}

	upsert(account: Account): void {
		const data = getLocalData();
		data.accounts[account.id] = account;
		saveLocalData(data);
	}

	softDelete(id: string): void {
		const data = getLocalData();
		if (data.accounts[id]) {
			data.accounts[id] = { ...data.accounts[id], deleted: true, updatedAt: new Date().toISOString() };
			saveLocalData(data);
		}
	}
}
