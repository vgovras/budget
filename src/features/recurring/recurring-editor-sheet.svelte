<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import NumberInput from '$lib/ui/number-input/number-input.svelte';
	import SheetActions from '$lib/ui/sheet-actions/sheet-actions.svelte';
	import CategoryPicker from '$features/add-expense/category-picker/category-picker.svelte';
	import type { RecurringEditorSheetViewModel } from './recurring-editor-sheet.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: RecurringEditorSheetViewModel } = $props();

	const currency = $derived(accountsVM.active?.currencyCode ?? settingsVM.currency);

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({
			value: a.id,
			label: `${a.name} (${a.currencyCode} ${fmt(a.balance)})`
		}))
	);

	const frequencyOptions = [
		{ value: 'daily', label: m.recurring_daily() },
		{ value: 'weekly', label: m.recurring_weekly() },
		{ value: 'monthly', label: m.recurring_monthly() }
	];
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<div class="sheet-tabs">
			<button
				class="sheet-tab"
				class:active={vm.type === 'expense'}
				onclick={() => (vm.type = 'expense')}
			>
				{m.tab_expense()}
			</button>
			<button
				class="sheet-tab income-tab"
				class:active={vm.type === 'income'}
				onclick={() => (vm.type = 'income')}
			>
				{m.tab_income()}
			</button>
		</div>

		<div class="sheet-field">
			<MoneyInput bind:value={vm.amount} {currency} size="sm" class="w-full" autofocus={vm.isOpen} />
		</div>

		<CategoryPicker
			selected={vm.icon}
			onSelect={(icon) => vm.selectCategory(icon)}
			type={vm.type === 'income' ? 'income' : 'expense'}
		/>

		<input
			class="field-input"
			type="text"
			placeholder={m.placeholder_note()}
			bind:value={vm.note}
		/>

		<Dropdown bind:value={vm.frequency} options={frequencyOptions} />
		{#if vm.frequency === 'monthly'}
			<NumberInput bind:value={vm.dayOfMonth} min={1} max={31} label={m.sub_billing_day()} />
		{/if}

		{#if accountsVM.accounts.length > 1}
			<Dropdown bind:value={vm.accountId} options={accountOptions} />
		{/if}

		<SheetActions>
			{#if vm.isEditing}
				<Button variant="destructive" size="lg" class="flex-1" onclick={() => vm.delete()}>
					{m.button_delete()}
				</Button>
			{/if}
			<Button variant="accent" size="lg" class="flex-1" disabled={!vm.canSave} onclick={() => vm.save()}>
				{m.button_save()}
			</Button>
		</SheetActions>
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
		background: var(--surface-4);
		border: 1px solid var(--border);
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
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--text-lo);
		background: transparent;
	}
	.sheet-tab.active {
		background: var(--surface-8);
		color: var(--text-hi);
	}
	.sheet-tab.income-tab.active {
		background: var(--income-bg);
		color: var(--income);
	}
</style>
