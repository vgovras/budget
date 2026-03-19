import type { CategoryType } from '$lib/types.js';
import { categoriesVM } from '../categories.svelte.js';
import { CAT_COLOR_PRESETS } from '$lib/constants.js';

export class CategoryEditorSheetViewModel {
	isOpen = $state(false);
	editingId = $state<string | null>(null);
	icon = $state('utensils');
	label = $state('');
	bg = $state(CAT_COLOR_PRESETS[0].bg);
	border = $state(CAT_COLOR_PRESETS[0].border);
	categoryType = $state<CategoryType>('expense');
	commission = $state(0);
	showAdvanced = $state(false);

	readonly isEditing = $derived(this.editingId !== null);
	readonly canSave = $derived(this.label.trim().length > 0);

	open(type: CategoryType = 'expense') {
		this.editingId = null;
		this.icon = 'utensils';
		this.label = '';
		this.bg = CAT_COLOR_PRESETS[0].bg;
		this.border = CAT_COLOR_PRESETS[0].border;
		this.categoryType = type;
		this.commission = 0;
		this.showAdvanced = false;
		this.isOpen = true;
	}

	openEdit(id: string) {
		const cat = categoriesVM.getById(id);
		if (!cat) return;
		this.editingId = id;
		this.icon = cat.icon;
		this.label = cat.label;
		this.bg = cat.bg;
		this.border = cat.border;
		this.categoryType = cat.type ?? 'expense';
		this.commission = cat.commission ?? 0;
		this.showAdvanced = (cat.commission ?? 0) > 0;
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	setColor(bg: string, border: string) {
		this.bg = bg;
		this.border = border;
	}

	save() {
		if (!this.canSave) return;
		const data = {
			icon: this.icon,
			label: this.label.trim(),
			bg: this.bg,
			border: this.border,
			type: this.categoryType,
			commission: this.commission > 0 ? this.commission : undefined,
			isDefault: false
		};
		if (this.editingId) {
			categoriesVM.update(this.editingId, data);
		} else {
			categoriesVM.add(data);
		}
		this.close();
	}
}
