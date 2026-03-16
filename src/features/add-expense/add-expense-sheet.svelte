<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import type { AddExpenseSheetViewModel } from './add-expense-sheet.svelte.js';
	import QuickChips from './quick-chips/quick-chips.svelte';
	import CategoryPicker from './category-picker/category-picker.svelte';
	import NoteInput from './note-input/note-input.svelte';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: AddExpenseSheetViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<div class="sheet-tabs">
			<button
				class="sheet-tab"
				class:active={vm.sheetType === 'expense'}
				onclick={() => vm.setType('expense')}
			>
				{m.tab_expense()}
			</button>
			<button
				class="sheet-tab"
				class:active={vm.sheetType === 'income'}
				onclick={() => vm.setType('income')}
			>
				{m.tab_income()}
			</button>
		</div>

		<QuickChips chips={vm.quickChips} onSelect={(chip) => vm.quickFill(chip)} />

		<div class="amount-field">
			<MoneyInput bind:value={vm.amount} size="lg" autofocus={vm.isOpen} />
		</div>

		{#if vm.sheetType === 'expense'}
			<CategoryPicker selected={vm.selectedCategory} onSelect={(e) => vm.selectCategory(e)} />
		{/if}

		<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />

		{#if vm.dailyBudget > 0 && vm.sheetType === 'expense'}
			<div class="daily-hint">{m.daily_hint_available_today()} ₴{fmt(vm.dailyBudget)}</div>
		{/if}

		<button class="btn-save" disabled={!vm.canSave} onclick={() => vm.save()}>
			{vm.sheetType === 'expense' ? m.button_save() : m.button_add_income()}
		</button>
	</div>
</BottomSheet>

<style>
	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.sheet-tabs {
		display: flex;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 12px;
		padding: 3px;
		gap: 3px;
	}

	.sheet-tab {
		flex: 1;
		padding: 9px 8px;
		border-radius: 9px;
		border: none;
		font-family: var(--font);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-lo);
		background: transparent;
	}

	.sheet-tab.active {
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
	}

	.amount-field {
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: var(--r-md);
		transition: all 0.2s ease;
	}
	.amount-field:focus-within {
		border-color: rgba(255, 255, 255, 0.16);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
	}

	.daily-hint {
		text-align: center;
		font-size: 12px;
		font-family: var(--font-mono);
		color: var(--text-lo);
		margin-top: -6px;
	}

	.btn-save {
		width: 100%;
		padding: 17px;
		border-radius: var(--r-md);
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		color: #ffffff;
		font-size: 17px;
		font-weight: 600;
		letter-spacing: 0.01em;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		transition: all 0.22s ease;
		font-family: var(--font);
		cursor: pointer;
		box-shadow:
			0 8px 32px rgba(255, 255, 255, 0.03),
			inset 0 1px 0 rgba(255, 255, 255, 0.1);
	}

	.btn-save:disabled {
		opacity: 0.22;
		cursor: not-allowed;
		box-shadow: none;
		border-color: var(--border);
	}

	.btn-save:not(:disabled):hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.2);
	}
</style>
