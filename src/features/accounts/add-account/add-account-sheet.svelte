<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import SheetForm from '$lib/ui/sheet-form/sheet-form.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import AmountField from '$lib/ui/amount-field/amount-field.svelte';
	import type { AddAccountSheetViewModel } from './add-account-sheet.svelte.js';
	import { CURRENCIES, CURRENCY_CODES } from '$lib/constants.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: AddAccountSheetViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<SheetForm title={m.add_account_title()}>
		<FormField label={m.field_label_name()}>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_account_name()}
				bind:value={vm.name}
			/>
		</FormField>

		<FormField label={m.field_label_currency()}>
			<div class="type-chips">
				{#each CURRENCIES as cur (cur)}
					<button
						class="type-chip currency-chip"
						class:active={vm.currency === cur}
						onclick={() => (vm.currency = cur)}
					>
						{cur} {CURRENCY_CODES[cur] ?? ''}
					</button>
				{/each}
			</div>
		</FormField>

		<FormField label={m.field_label_budget_balance()}>
			<AmountField>
				<MoneyInput bind:value={vm.budget} size="lg" />
			</AmountField>
		</FormField>

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_create()}
		</Button>
	</SheetForm>
</BottomSheet>

<style>
	.field-input {
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
		transition: border-color 0.2s ease;
	}
	.field-input::placeholder {
		color: var(--text-lo);
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.type-chips {
		display: flex;
		gap: 8px;
	}

	.type-chip {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		padding: 12px 8px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-lo);
		font-size: 13px;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.currency-chip {
		flex: 1;
		padding: 10px 8px;
		font-size: 14px;
	}
	.type-chip.active {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
	}
</style>
