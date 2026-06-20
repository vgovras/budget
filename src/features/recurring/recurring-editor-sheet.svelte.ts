import { recurringVM } from './recurring.svelte.js';
import { accountsVM } from '$features/accounts/accounts.svelte.js';
import { categoriesVM } from '$features/categories/categories.svelte.js';

export class RecurringEditorSheetViewModel {
	isOpen = $state(false);
	editingId = $state<string | null>(null);
	categoryId = $state<string | null>(null);
	label = $state('');
	note = $state('');
	amount = $state<number | null>(null);
	accountId = $state('');
	type = $state<'expense' | 'income'>('expense');
	frequency = $state<'daily' | 'weekly' | 'monthly'>('monthly');
	dayOfMonth = $state(1);

	readonly isEditing = $derived(this.editingId !== null);
	readonly canSave = $derived(this.amount !== null && this.amount > 0);

	open() {
		this.editingId = null;
		this.categoryId = categoriesVM.expenseCategories[0]?.id ?? null;
		this.label = '';
		this.note = '';
		this.amount = null;
		this.accountId = accountsVM.active?.id ?? '';
		this.type = 'expense';
		this.frequency = 'monthly';
		this.dayOfMonth = 1;
		this.isOpen = true;
	}

	openEdit(id: string) {
		const item = recurringVM.items.find((r) => r.id === id);
		if (!item) return;
		this.editingId = id;
		// item.icon is an icon name; fall back to getById to recover legacy rows that stored a category id
		this.categoryId =
			categoriesVM.getByIcon(item.icon)?.id ?? categoriesVM.getById(item.icon)?.id ?? null;
		this.label = item.label;
		this.note = item.note;
		this.amount = item.amount;
		this.accountId = item.accountId;
		this.type = item.type;
		this.frequency = item.frequency;
		this.dayOfMonth = item.dayOfMonth ?? 1;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	selectCategory(id: string) {
		this.categoryId = id;
	}

	setType(type: 'expense' | 'income') {
		if (this.type === type) return;
		this.type = type;
		this.categoryId = categoriesVM.byType(type)[0]?.id ?? null;
	}

	save() {
		if (!this.canSave || !this.amount) return;

		const nextDate = this.#computeNextDate();

		const cat = categoriesVM.getById(this.categoryId ?? '');
		// name = the note if provided, otherwise the category label
		const name = this.note.trim() || cat?.label || '';

		const data = {
			icon: cat?.icon ?? 'wallet',
			label: name,
			note: name,
			amount: this.amount,
			accountId: this.accountId,
			type: this.type,
			frequency: this.frequency,
			dayOfMonth: this.frequency === 'monthly' ? this.dayOfMonth : undefined,
			nextDate: nextDate.toISOString(),
			enabled: true
		};

		if (this.editingId) {
			const existing = recurringVM.items.find((r) => r.id === this.editingId);
			recurringVM.update(this.editingId, { ...data, nextDate: existing?.nextDate ?? data.nextDate });
		} else {
			recurringVM.add(data);
		}

		this.close();
	}

	delete() {
		if (this.editingId) {
			recurringVM.remove(this.editingId);
		}
		this.close();
	}

	#computeNextDate(): Date {
		const now = new Date();
		switch (this.frequency) {
			case 'daily':
				return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
			case 'weekly':
				return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
			case 'monthly': {
				const day = Math.min(this.dayOfMonth, 28);
				const next = new Date(now.getFullYear(), now.getMonth(), day);
				if (next <= now) next.setMonth(next.getMonth() + 1);
				return next;
			}
		}
	}
}
