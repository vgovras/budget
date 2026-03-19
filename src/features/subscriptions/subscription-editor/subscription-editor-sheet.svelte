<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { SubscriptionEditorSheetViewModel } from './subscription-editor-sheet.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: SubscriptionEditorSheetViewModel } = $props();

	const accountOptions = $derived(
		accountsVM.accounts.map((a) => ({
			value: a.id,
			label: `${a.name} (${a.currency} ${fmt(a.balance)})`
		}))
	);

	const cycleOptions = [
		{ value: 'monthly', label: m.sub_cycle_monthly() },
		{ value: 'quarterly', label: m.sub_cycle_quarterly() },
		{ value: 'yearly', label: m.sub_cycle_yearly() },
	];

	const currencyOptions = vm.currencies.map((c) => ({ value: c, label: c }));
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{vm.isEditing ? m.sub_edit_title() : m.sub_add_title()}</h3>

		<!-- Service icon presets -->
		<div class="field">
			<span class="field-label">{m.sub_service()}</span>
			<div class="preset-grid">
				{#each vm.presets as preset (preset.icon)}
					<button
						class="preset-chip"
						class:active={vm.icon === preset.icon}
						onclick={() => vm.selectPreset(preset)}
						title={preset.label}
					>
						<Icon name={preset.icon} size={18} />
					</button>
				{/each}
			</div>
		</div>

		<!-- Name -->
		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.label}
			/>
		</div>

		<!-- Amount + Currency -->
		<div class="field">
			<span class="field-label">{m.sub_amount()}</span>
			<div class="amount-row">
				<div class="amount-field">
					<MoneyInput bind:value={vm.amount} currency={vm.currency} />
				</div>
				<Dropdown bind:value={vm.currency} options={currencyOptions} />
			</div>
		</div>

		<!-- Account -->
		<div class="field">
			<span class="field-label">{m.recurring_account()}</span>
			<Dropdown bind:value={vm.accountId} options={accountOptions} />
		</div>

		<!-- Cycle -->
		<div class="field">
			<span class="field-label">{m.sub_cycle()}</span>
			<Dropdown bind:value={vm.cycle} options={cycleOptions} />
		</div>

		<!-- Day of month -->
		<div class="field">
			<span class="field-label">{m.sub_billing_day()}</span>
			<input
				class="field-input"
				type="number"
				min="1"
				max="31"
				bind:value={vm.dayOfMonth}
			/>
		</div>

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
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
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

	.amount-field {
		flex: 1;
		padding: 6px 14px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-sm);
	}
	.amount-field:focus-within {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.preset-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.preset-chip {
		width: 42px;
		height: 42px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-lo);
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font);
	}
	.preset-chip:hover {
		background: rgba(255, 255, 255, 0.06);
	}
	.preset-chip.active {
		border-color: var(--accent);
		background: rgba(80, 130, 255, 0.12);
		color: var(--accent);
	}

	.actions {
		display: flex;
		gap: 10px;
	}
</style>
