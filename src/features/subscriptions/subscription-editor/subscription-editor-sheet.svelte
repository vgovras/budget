<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import NumberInput from '$lib/ui/number-input/number-input.svelte';
	import SheetForm from '$lib/ui/sheet-form/sheet-form.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import AmountField from '$lib/ui/amount-field/amount-field.svelte';
	import IconPicker from '$lib/ui/icon-picker/icon-picker.svelte';
	import SheetActions from '$lib/ui/sheet-actions/sheet-actions.svelte';
	import type { SubscriptionEditorSheetViewModel } from './subscription-editor-sheet.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: SubscriptionEditorSheetViewModel } = $props();

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({
			value: a.id,
			label: `${a.name} (${a.currencyCode} ${fmt(a.balance)})`
		}))
	);

	const cycleOptions = [
		{ value: 'monthly', label: m.sub_cycle_monthly() },
		{ value: 'quarterly', label: m.sub_cycle_quarterly() },
		{ value: 'yearly', label: m.sub_cycle_yearly() },
	];

	const currencyOptions = $derived(vm.currencies.map((c) => ({ value: c, label: c })));

	function handleIconSelect(icon: string) {
		const preset = vm.presets.find((p) => p.icon === icon);
		if (preset) vm.selectPreset(preset);
	}
</script>

<BottomSheet bind:open={vm.isOpen}>
	<SheetForm title={vm.isEditing ? m.sub_edit_title() : m.sub_add_title()}>
		<FormField label={m.field_label_name()}>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.label}
			/>
		</FormField>

		<FormField label={m.sub_service()}>
			<IconPicker
				icons={vm.presets}
				selected={vm.icon}
				onSelect={handleIconSelect}
			/>
		</FormField>

		<FormField label={m.sub_amount()}>
			<div class="amount-row">
				<AmountField>
					<MoneyInput bind:value={vm.amount} currency={vm.currency} />
				</AmountField>
				<Dropdown bind:value={vm.currency} options={currencyOptions} />
			</div>
		</FormField>

		{#if accountOptions.length > 1}
			<FormField label={m.recurring_account()}>
				<Dropdown bind:value={vm.accountId} options={accountOptions} />
			</FormField>
		{/if}

		<FormField label={m.sub_cycle()}>
			<Dropdown bind:value={vm.cycle} options={cycleOptions} />
		</FormField>

		<NumberInput bind:value={vm.dayOfMonth} min={1} max={31} label={m.sub_billing_day()} />

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
	</SheetForm>
</BottomSheet>

<style>
	.field-input {
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid var(--surface-8);
		background: var(--surface-5);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
	}
	.field-input::placeholder {
		color: var(--text-lo);
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.amount-row {
		display: flex;
		gap: 10px;
		align-items: center;
	}
</style>
