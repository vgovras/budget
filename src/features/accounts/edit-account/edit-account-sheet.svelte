<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import Toggle from '$lib/ui/toggle/toggle.svelte';
	import SheetForm from '$lib/ui/sheet-form/sheet-form.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import AmountField from '$lib/ui/amount-field/amount-field.svelte';
	import SheetActions from '$lib/ui/sheet-actions/sheet-actions.svelte';
	import type { EditAccountSheetViewModel } from './edit-account-sheet.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm, onDelete }: { vm: EditAccountSheetViewModel; onDelete?: (id: string, name: string) => void } = $props();

	const currency = $derived(vm.account?.currencyCode ?? settingsVM.currency);
</script>

<BottomSheet bind:open={vm.isOpen}>
	<SheetForm title={m.edit_account_title()}>
		<FormField label={m.field_label_name()}>
			<input class="field-input" type="text" bind:value={vm.name} />
		</FormField>

		<FormField label={m.account_balance()}>
			<AmountField>
				<MoneyInput bind:value={vm.balance} {currency} />
			</AmountField>
		</FormField>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="primary-row" onclick={() => vm.togglePrimary()}>
			<div class="primary-info">
				<Icon name="star" size={16} />
				<span>{m.label_primary_account()}</span>
			</div>
			<Toggle checked={vm.isPrimary} />
		</div>

		<SheetActions>
			<Button variant="destructive" size="lg" class="flex-1 gap-2" onclick={() => { vm.close(); onDelete?.(vm.accountId, vm.name); }}>
				<Icon name="trash" size={16} />
				{m.button_delete()}
			</Button>
			<Button variant="soft" size="lg" class="flex-1" disabled={!vm.canSave} onclick={() => vm.save()}>
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
		font-size: 1rem;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.primary-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		background: var(--surface-3);
		border: 1px solid var(--surface-8);
		border-radius: 14px;
		cursor: pointer;
	}
	.primary-info {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 0.875rem;
		color: var(--text-primary);
	}
</style>
