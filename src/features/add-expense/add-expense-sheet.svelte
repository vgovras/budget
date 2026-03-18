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

	let { vm, onTransfer }: { vm: AddExpenseSheetViewModel; onTransfer?: () => void } = $props();
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
				class="sheet-tab income-tab"
				class:active={vm.sheetType === 'income'}
				onclick={() => vm.setType('income')}
			>
				{m.tab_income()}
			</button>
			<button
				class="sheet-tab transfer-tab"
				onclick={() => { vm.close(); onTransfer?.(); }}
			>
				{m.transfer_title()}
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

		<!-- Tags -->
		<div class="tags-section">
			<div class="tags-row">
				{#each vm.tags as tag (tag)}
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<span class="tag-chip" onclick={() => vm.removeTag(tag)}>
						{tag} ×
					</span>
				{/each}
				<input
					class="tag-input"
					type="text"
					placeholder={m.tag_placeholder()}
					bind:value={vm.tagInput}
					onkeydown={(e) => {
						if (e.key === 'Enter' && vm.tagInput.trim()) {
							e.preventDefault();
							vm.addTag(vm.tagInput);
						}
					}}
				/>
			</div>
			{#if vm.tagSuggestions.length > 0}
				<div class="tag-suggestions">
					{#each vm.tagSuggestions.slice(0, 5) as sug (sug)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<span class="tag-sug" onclick={() => vm.addTag(sug)}>{sug}</span>
					{/each}
				</div>
			{/if}
		</div>

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
		border: 1px solid rgba(255, 255, 255, 0.07);
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
	.sheet-tab.income-tab.active {
		background: var(--income-bg);
		color: var(--income);
	}

	.amount-field {
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
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
		border: 1px solid rgba(80, 130, 255, 0.25);
		background: rgba(80, 130, 255, 0.08);
		color: rgba(80, 130, 255, 0.7);
		font-size: 17px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		overflow: hidden;
		transition: all 0.22s ease;
		font-family: var(--font);
		cursor: pointer;
	}

	.btn-save:disabled {
		opacity: 0.22;
		cursor: not-allowed;
		border-color: rgba(255, 255, 255, 0.07);
	}

	.btn-save:not(:disabled):hover {
		background: rgba(80, 130, 255, 0.14);
		border-color: rgba(80, 130, 255, 0.3);
	}

	.tags-section {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.tags-row {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		align-items: center;
	}
	.tag-chip {
		padding: 4px 10px;
		border-radius: 8px;
		background: var(--accent-bg);
		border: 1px solid var(--accent-border);
		color: var(--accent);
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
	}
	.tag-input {
		flex: 1;
		min-width: 80px;
		background: none;
		border: none;
		outline: none;
		font-size: 13px;
		color: var(--text-hi);
		font-family: var(--font);
		padding: 4px 0;
	}
	.tag-input::placeholder {
		color: var(--text-lo);
	}
	.tag-suggestions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.tag-sug {
		padding: 3px 8px;
		border-radius: 6px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.07);
		color: var(--text-mid);
		font-size: 11px;
		cursor: pointer;
	}
	.tag-sug:hover {
		background: rgba(255, 255, 255, 0.08);
	}
</style>
