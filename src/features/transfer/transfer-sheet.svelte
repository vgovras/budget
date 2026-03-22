<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { TransferSheetViewModel } from './transfer-sheet.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: TransferSheetViewModel } = $props();

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({
			value: a.id,
			label: `${a.name} (${a.currency} ${fmt(a.balance)})`
		}))
	);
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{m.transfer_title()}</h3>

		<div class="field">
			<span class="field-label">{m.transfer_from()}</span>
			<Dropdown bind:value={vm.fromAccountId} options={accountOptions} />
		</div>

		<div class="field">
			<span class="field-label">{m.transfer_to()}</span>
			<Dropdown bind:value={vm.toAccountId} options={accountOptions} />
		</div>

		<div class="field">
			<span class="field-label">{m.transfer_amount()}</span>
			<div class="amount-field">
				<MoneyInput
					bind:value={vm.amount}
					currency={vm.fromAccount?.currency ?? settingsVM.currency}
					size="lg"
				/>
			</div>
		</div>

		{#if vm.isCrossCurrency}
			<div class="field">
				<span class="field-label">{m.transfer_exchange_rate()}</span>
				<input
					class="field-input"
					type="number"
					step="0.01"
					min="0"
					bind:value={vm.exchangeRate}
				/>
				{#if vm.amount && vm.amount > 0}
					<span class="field-hint">
						= {vm.toAccount?.currency} {fmt(vm.convertedAmount)}
					</span>
				{/if}
			</div>
		{/if}

		<div class="field">
			<span class="field-label">{m.placeholder_note()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_note()}
				bind:value={vm.note}
			/>
		</div>

		<Button variant="soft" size="lg" class="gap-2" disabled={!vm.canSave} onclick={() => vm.save()}>
			<Icon name="arrow-left-right" size={18} />
			{m.button_transfer()}
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
		padding: 14px 16px;
		border-radius: var(--r-sm);
		border: 1px solid var(--surface-8);
		background: var(--surface-5);
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

	.field-hint {
		font-size: 13px;
		color: var(--accent);
		padding-left: 2px;
	}

	.amount-field {
		padding: 16px 18px;
		background: var(--surface-5);
		border: 1px solid var(--border-hi);
		border-radius: var(--r-md);
		transition: border-color 0.2s ease;
	}
	.amount-field:focus-within {
		border-color: rgba(221, 232, 240, 0.28);
	}

</style>
