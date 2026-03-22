<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import type { AddAccountSheetViewModel } from './add-account-sheet.svelte.js';
	import { CURRENCIES, CURRENCY_CODES } from '$lib/constants.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: AddAccountSheetViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{m.add_account_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_account_name()}
				bind:value={vm.name}
			/>
		</div>

		<div class="field">
			<span class="field-label">{m.field_label_currency()}</span>
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
		</div>

		<div class="field">
			<span class="field-label">{m.field_label_budget_balance()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.budget} size="lg" />
			</div>
		</div>

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_create()}
		</Button>
	</div>
</BottomSheet>

<style>
	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.sheet-title {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text-hi);
		text-align: center;
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

	.amount-field {
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-md);
		transition: border-color 0.2s ease;
	}
	.amount-field:focus-within {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.field-hint {
		font-size: 11px;
		color: var(--text-lo);
		padding-left: 2px;
	}
</style>
