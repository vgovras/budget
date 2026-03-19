<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import type { AddExpenseSheetViewModel } from './add-expense-sheet.svelte.js';
	import QuickChips from './quick-chips/quick-chips.svelte';
	import CategoryPicker from './category-picker/category-picker.svelte';
	import NoteInput from './note-input/note-input.svelte';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	import { fly, fade } from 'svelte/transition';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';

	let { vm }: { vm: AddExpenseSheetViewModel } = $props();

	$effect(() => {
		vm.toAccountId;
		vm.syncExchangeRate();
	});

	const transferAccountOptions = $derived(
		accountsVM.accounts
			.filter((a) => a.id !== accountsVM.active?.id)
			.map((a) => ({ value: a.id, label: `${a.name} (${a.currency} ${fmt(a.balance)})` }))
	);

	const canTransfer = $derived(accountsVM.accounts.length > 1);
	let showTransferTooltip = $state(false);
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
			<div class="transfer-tab-wrap">
				<button
					class="sheet-tab transfer-tab"
					class:active={vm.sheetType === 'transfer'}
					class:disabled={!canTransfer}
					onclick={() => {
						if (canTransfer) {
							vm.setType('transfer');
							showTransferTooltip = false;
						} else {
							showTransferTooltip = !showTransferTooltip;
						}
					}}
				>
					{m.transfer_title()}
				</button>
				{#if showTransferTooltip && !canTransfer}
					<div class="tooltip" transition:fly={{ y: 6, duration: 200 }}>{m.transfer_needs_two_accounts()}</div>
				{/if}
			</div>
		</div>

		{#if vm.sheetType === 'transfer'}
			<!-- Transfer content -->
			<div class="field">
				<span class="field-label">{m.transfer_to()}</span>
				<Dropdown bind:value={vm.toAccountId} options={transferAccountOptions} />
			</div>

			<div class="amount-field">
				<MoneyInput bind:value={vm.amount} currency={accountsVM.active?.currency ?? settingsVM.currency} size="lg" autofocus={vm.isOpen} />
			</div>

			{#if vm.isCrossCurrency}
				<div class="field">
					<span class="field-label">{m.transfer_exchange_rate()}</span>
					<input class="field-input" type="number" step="0.01" min="0" bind:value={vm.exchangeRate} />
					{#if vm.amount && vm.amount > 0}
						<span class="convert-hint">= {vm.toAccount?.currency} {fmt(vm.convertedAmount)}</span>
					{/if}
				</div>
			{/if}

			<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />

			<Button variant="accent" size="lg" class="gap-2" disabled={!vm.canSave} onclick={() => vm.save()}>
				<Icon name="arrow-left-right" size={18} />
				{m.button_transfer()}
			</Button>
		{:else}
			<!-- Expense / Income content -->
			<QuickChips chips={vm.quickChips} currency={accountsVM.active?.currency ?? settingsVM.currency} onSelect={(chip) => vm.quickFill(chip)} />

			<div class="amount-field">
				<MoneyInput bind:value={vm.amount} currency={accountsVM.active?.currency ?? settingsVM.currency} size="lg" autofocus={vm.isOpen} />
			</div>

			<CategoryPicker selected={vm.selectedCategory} onSelect={(e) => vm.selectCategory(e)} type={vm.sheetType === 'income' ? 'income' : 'expense'} />

			<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />

			{#if vm.dailyBudget > 0 && vm.sheetType === 'expense'}
				<div class="daily-hint">{m.daily_hint_available_today()} {vm.displayCurrency}{fmt(vm.dailyBudget)}</div>
			{/if}

			<Button variant="accent" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
				{vm.sheetType === 'expense' ? m.button_save() : m.button_add_income()}
			</Button>
		{/if}
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
	.sheet-tab.transfer-tab.active {
		background: var(--accent-bg);
		color: var(--accent);
	}
	.sheet-tab.disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.transfer-tab-wrap {
		flex: 1;
		position: relative;
	}
	.transfer-tab-wrap .sheet-tab {
		width: 100%;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: rgba(30, 30, 40, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 10px;
		padding: 8px 12px;
		font-size: 12px;
		color: var(--text-hi);
		white-space: nowrap;
		z-index: 10;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	}
	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 6px solid transparent;
		border-top-color: rgba(30, 30, 40, 0.95);
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

	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field-label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-mid);
		padding-left: 2px;
	}
	.field-input {
		padding: 14px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}
	.convert-hint {
		font-size: 13px;
		color: var(--accent);
		padding-left: 2px;
	}

</style>
