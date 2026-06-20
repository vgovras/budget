<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import SheetForm from '$lib/ui/sheet-form/sheet-form.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
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
			<div class="sheet-field">
				<MoneyInput bind:value={vm.balance} size="sm" class="w-full" />
			</div>
		</FormField>

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_create()}
		</Button>
	</SheetForm>
</BottomSheet>

<style>
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
		border: 1px solid var(--surface-8);
		background: var(--surface-4);
		color: var(--text-lo);
		font-size: 0.8125rem;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.currency-chip {
		flex: 1;
		padding: 10px 8px;
		font-size: 0.875rem;
	}
	.type-chip.active {
		border-color: var(--text-muted);
		background: var(--surface-8);
		color: var(--text-hi);
	}
</style>
