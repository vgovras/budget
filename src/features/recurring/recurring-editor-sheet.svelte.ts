import { recurringVM } from './recurring.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';

export class RecurringEditorSheetViewModel {
	isOpen = $state(false);
	editingId = $state<string | null>(null);
	icon = $state('utensils');
	label = $state('');
	note = $state('');
	amount = $state<number | null>(null);
	accountId = $state('');
	type = $state<'expense' | 'income'>('expense');
	frequency = $state<'daily' | 'weekly' | 'monthly'>('monthly');

	readonly isEditing = $derived(this.editingId !== null);
	readonly canSave = $derived(this.label.trim().length > 0 && this.amount !== null && this.amount > 0);

	open() {
		this.editingId = null;
		this.icon = categoriesVM.categories[0]?.icon ?? 'utensils';
		this.label = '';
		this.note = '';
		this.amount = null;
		this.accountId = accountsVM.accounts[0]?.id ?? '';
		this.type = 'expense';
		this.frequency = 'monthly';
		this.isOpen = true;
	}

	openEdit(id: string) {
		const item = recurringVM.items.find((r) => r.id === id);
		if (!item) return;
		this.editingId = id;
		this.icon = item.icon;
		this.label = item.label;
		this.note = item.note;
		this.amount = item.amount;
		this.accountId = item.accountId;
		this.type = item.type;
		this.frequency = item.frequency;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	save() {
		if (!this.canSave || !this.amount) return;

		const now = new Date();
		let nextDate: Date;

		switch (this.frequency) {
			case 'daily':
				nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
				break;
			case 'weekly':
				nextDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
				break;
			case 'monthly':
				nextDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
				break;
		}

		const data = {
			icon: this.icon,
			label: this.label.trim(),
			note: this.note,
			amount: this.amount,
			accountId: this.accountId,
			type: this.type,
			frequency: this.frequency,
			nextDate: nextDate.toISOString(),
			enabled: true
		};

		if (this.editingId) {
			recurringVM.update(this.editingId, data);
		} else {
			recurringVM.add(data);
		}
		this.close();
	}
}
