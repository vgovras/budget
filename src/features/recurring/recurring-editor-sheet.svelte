<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import NumberInput from '$lib/ui/number-input/number-input.svelte';
	import CategoryPicker from '$features/add-expense/category-picker/category-picker.svelte';
	import type { RecurringEditorSheetViewModel } from './recurring-editor-sheet.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: RecurringEditorSheetViewModel } = $props();

	const currency = $derived(accountsVM.active?.currency ?? settingsVM.currency);

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({
			value: a.id,
			label: `${a.name} (${a.currency} ${fmt(a.balance)})`
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
		<!-- Tabs -->
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

		<!-- Amount -->
		<div class="amount-field">
			<MoneyInput bind:value={vm.amount} {currency} size="lg" autofocus={vm.isOpen} />
		</div>

		<!-- Category -->
		<CategoryPicker
			selected={vm.icon}
			onSelect={(icon) => vm.selectCategory(icon)}
			type={vm.type === 'income' ? 'income' : 'expense'}
		/>

		<!-- Note -->
		<input
			class="note-field"
			type="text"
			placeholder={m.placeholder_note()}
			bind:value={vm.note}
		/>

		<!-- Frequency + Day -->
		<Dropdown bind:value={vm.frequency} options={frequencyOptions} />
		{#if vm.frequency === 'monthly'}
			<NumberInput bind:value={vm.dayOfMonth} min={1} max={31} label={m.sub_billing_day()} />
		{/if}

		<!-- Account -->
		{#if accountsVM.accounts.length > 1}
			<Dropdown bind:value={vm.accountId} options={accountOptions} />
		{/if}

		<!-- Actions -->
		<div class="actions">
			{#if vm.isEditing}
				<Button variant="destructive" size="lg" class="flex-1" onclick={() => vm.delete()}>
					{m.button_delete()}
				</Button>
			{/if}
			<Button variant="accent" size="lg" class="flex-1" disabled={!vm.canSave} onclick={() => vm.save()}>
				{m.button_save()}
			</Button>
		</div>
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

	.note-field {
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.03);
		font-size: 15px;
		width: 100%;
		color: var(--text-hi);
		font-family: var(--font);
		transition: border-color 0.2s ease;
	}
	.note-field::placeholder { color: var(--text-lo); }
	.note-field:focus { border-color: rgba(255, 255, 255, 0.16); outline: none; }

	.row {
		display: flex;
		gap: 10px;
		align-items: flex-start;
	}
	.flex-1 { flex: 1; }

	.field {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.day-field {
		width: 80px;
		align-items: center;
	}

	.day-input {
		width: 100%;
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		text-align: center;
		outline: none;
	}
	.day-input:focus { border-color: rgba(255, 255, 255, 0.16); }

	.day-hint {
		font-size: 10px;
		color: var(--text-lo);
		text-align: center;
	}

	.actions {
		display: flex;
		gap: 10px;
	}
</style>
