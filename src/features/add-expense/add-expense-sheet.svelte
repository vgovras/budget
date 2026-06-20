<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import DatePicker from '$lib/ui/date-picker/date-picker.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import CategoryPicker from './category-picker/category-picker.svelte';
	import NoteInput from './note-input/note-input.svelte';
	import type { AddExpenseSheetViewModel } from './add-expense-sheet.svelte.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import { fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: AddExpenseSheetViewModel } = $props();

	$effect(() => {
		vm.toAccountId;
		vm.syncExchangeRate();
	});

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({ value: a.id, label: `${a.name} (${a.currencyCode} ${fmt(a.balance)})` }))
	);

	const transferAccountOptions = $derived(
		accountsVM.accounts
			.filter((a) => a.id !== vm.selectedAccountId)
			.map((a) => ({ value: a.id, label: `${a.name} (${a.currencyCode} ${fmt(a.balance)})` }))
	);

	const canTransfer = $derived(accountsVM.accounts.length > 1);
	let showTransferTooltip = $state(false);

	const tabs = [
		{ id: 'expense', label: m.tab_expense() },
		{ id: 'income', label: m.tab_income() },
		{ id: 'transfer', label: m.transfer_title() }
	] as const;

	const tabActive: Record<(typeof tabs)[number]['id'], string> = {
		expense: 'bg-surface-8 text-text-hi',
		income: 'bg-income-bg text-income',
		transfer: 'bg-accent-bg text-accent'
	};
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="flex flex-col gap-4">
		<!-- Type tabs -->
		<div class="flex bg-card-elevated border border-border rounded-sm p-[3px] gap-[3px]">
			{#each tabs as tab (tab.id)}
				{#if tab.id === 'transfer'}
					<div class="flex-1 relative">
						<button
							class="w-full h-9 rounded-[10px] font-sans text-s font-medium transition-all duration-200
								{vm.sheetType === 'transfer' ? tabActive.transfer : 'text-text-mid'}
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
							{tab.label}
						</button>
						{#if showTransferTooltip && !canTransfer}
							<div class="tooltip" transition:fly={{ y: 6, duration: 200 }}>{m.transfer_needs_two_accounts()}</div>
						{/if}
					</div>
				{:else}
					<button
						class="flex-1 h-9 rounded-[10px] font-sans text-s font-medium transition-all duration-200
							{vm.sheetType === tab.id ? tabActive[tab.id] : 'text-text-mid'}"
						onclick={() => vm.setType(tab.id)}
					>
						{tab.label}
					</button>
				{/if}
			{/each}
		</div>

		<!-- Account -->
		{#if accountsVM.accounts.length > 1}
			<FormField label={m.recurring_account()}>
				<Dropdown bind:value={vm.selectedAccountId} options={accountOptions} />
			</FormField>
		{/if}

		{#if vm.sheetType === 'transfer'}
			<!-- Transfer target -->
			<FormField label={m.transfer_to()}>
				<Dropdown bind:value={vm.toAccountId} options={transferAccountOptions} />
			</FormField>

			<FormField label={m.label_amount()}>
				<div class="sheet-field">
					<MoneyInput
						bind:value={vm.amount}
						currency={vm.selectedAccount?.currencyCode ?? settingsVM.currency}
						size="sm"
						class="w-full"
						autofocus={vm.isOpen}
					/>
				</div>
			</FormField>

			{#if vm.isCrossCurrency}
				<FormField label={m.transfer_exchange_rate()}>
					<div class="sheet-field">
						<input
							class="w-full bg-transparent text-base text-text-hi font-sans outline-none"
							type="number"
							step="0.01"
							min="0"
							bind:value={vm.exchangeRate}
						/>
					</div>
					{#if vm.amount && vm.amount > 0}
						<span class="text-sm text-accent pl-0.5">= {vm.toAccount?.currencyCode} {fmt(vm.convertedAmount)}</span>
					{/if}
				</FormField>
			{/if}

			<FormField label={m.label_note()}>
				<NoteInput bind:value={vm.note} expenses={expensesVM.expenses} />
			</FormField>

			<FormField label={m.label_date()}>
				<DatePicker bind:value={vm.selectedDate} />
			</FormField>

			<Button variant="accent" size="lg" class="gap-2" disabled={!vm.canSave} onclick={() => vm.save()}>
				<Icon name="arrow-left-right" size={18} />
				{m.button_transfer()}
			</Button>
		{:else}
			<!-- Category -->
			<FormField label={m.label_category()}>
				<CategoryPicker
					selected={vm.selectedCategory}
					onSelect={(e) => vm.selectCategory(e)}
					type={vm.sheetType === 'income' ? 'income' : 'expense'}
				/>
			</FormField>

			<FormField label={m.label_amount()}>
				<div class="sheet-field">
					<MoneyInput bind:value={vm.amount} currency={vm.displayCurrency} size="sm" class="w-full" autofocus={vm.isOpen} />
				</div>
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
		background: var(--card-elevated);
		border: 1px solid var(--surface-12);
		border-radius: var(--r-sm);
		padding: 8px 12px;
		font-size: 0.75rem;
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
		border-top-color: var(--card-elevated);
	}
</style>
