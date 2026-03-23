<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import AmountField from '$lib/ui/amount-field/amount-field.svelte';
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
	import DatePicker from '$lib/ui/date-picker/date-picker.svelte';

	let { vm }: { vm: AddExpenseSheetViewModel } = $props();

	$effect(() => {
		vm.toAccountId;
		vm.syncExchangeRate();
	});

	const accountOptions = $derived(
		accountsVM.accounts
			.map((a) => ({ value: a.id, label: `${a.name} (${a.currency} ${fmt(a.balance)})` }))
	);

	const transferAccountOptions = $derived(
		accountsVM.accounts
			.filter((a) => a.id !== vm.selectedAccountId)
			.map((a) => ({ value: a.id, label: `${a.name} (${a.currency} ${fmt(a.balance)})` }))
	);

	const canTransfer = $derived(accountsVM.accounts.length > 1);
	let showTransferTooltip = $state(false);
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="flex flex-col gap-4">
		<div class="flex bg-surface-4 border border-border rounded-xl p-[3px] gap-[3px]">
			<button
				class="flex-1 py-2.5 px-2 rounded-[9px] font-sans text-sm font-medium transition-all duration-200
					{vm.sheetType === 'expense' ? 'bg-surface-8 text-text-hi' : 'text-text-lo'}"
				onclick={() => vm.setType('expense')}
			>
				{m.tab_expense()}
			</button>
			<button
				class="flex-1 py-2.5 px-2 rounded-[9px] font-sans text-sm font-medium transition-all duration-200
					{vm.sheetType === 'income' ? 'bg-income-bg text-income' : 'text-text-lo'}"
				onclick={() => vm.setType('income')}
			>
				{m.tab_income()}
			</button>
			<div class="flex-1 relative">
				<button
					class="w-full py-2.5 px-2 rounded-[9px] font-sans text-sm font-medium transition-all duration-200
						{vm.sheetType === 'transfer' ? 'bg-accent-bg text-accent' : 'text-text-lo'}
						{!canTransfer ? 'opacity-30 cursor-not-allowed' : ''}"
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

		{#if accountsVM.accounts.length > 1}
			<FormField label={m.recurring_account()}>
				<Dropdown bind:value={vm.selectedAccountId} options={accountOptions} />
			</FormField>
		{/if}

		{#if vm.sheetType === 'transfer'}
			<FormField label={m.transfer_to()}>
				<Dropdown bind:value={vm.toAccountId} options={transferAccountOptions} />
			</FormField>

			<AmountField>
				<MoneyInput bind:value={vm.amount} currency={vm.selectedAccount?.currency ?? settingsVM.currency} size="lg" autofocus={vm.isOpen} />
			</AmountField>

			{#if vm.isCrossCurrency}
				<FormField label={m.transfer_exchange_rate()}>
					<input class="px-4 py-3 rounded-sm border border-surface-8 bg-surface-5 text-base text-text-hi font-sans" type="number" step="0.01" min="0" bind:value={vm.exchangeRate} />
					{#if vm.amount && vm.amount > 0}
						<span class="text-sm text-accent pl-0.5">= {vm.toAccount?.currency} {fmt(vm.convertedAmount)}</span>
					{/if}
				</FormField>
			{/if}

			<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />

			<FormField label={m.label_date()}>
				<DatePicker bind:value={vm.selectedDate} />
			</FormField>

			<Button variant="accent" size="lg" class="gap-2" disabled={!vm.canSave} onclick={() => vm.save()}>
				<Icon name="arrow-left-right" size={18} />
				{m.button_transfer()}
			</Button>
		{:else}
			<FormField label={m.label_category()}>
				<CategoryPicker selected={vm.selectedCategory} onSelect={(e) => vm.selectCategory(e)} type={vm.sheetType === 'income' ? 'income' : 'expense'} />
			</FormField>

			<FormField label={m.label_amount()}>
				<AmountField>
					<MoneyInput bind:value={vm.amount} currency={vm.displayCurrency} size="lg" autofocus={vm.isOpen} />
				</AmountField>
			</FormField>

			<FormField label={m.label_note()}>
				<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />
			</FormField>

			<FormField label={m.label_date()}>
				<DatePicker bind:value={vm.selectedDate} />
			</FormField>

			<Button variant="accent" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
				{vm.sheetType === 'expense' ? m.button_save() : m.button_add_income()}
			</Button>
		{/if}
	</div>
</BottomSheet>

<style>
	.tooltip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translateX(-50%);
		background: rgba(30, 30, 40, 0.95);
		border: 1px solid var(--surface-12);
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
</style>
