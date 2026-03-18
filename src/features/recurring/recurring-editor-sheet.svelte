<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { RecurringEditorSheetViewModel } from './recurring-editor-sheet.svelte.js';
	import { categoriesVM } from '$features/categories/categories.svelte.js';
	import { accountsVM } from '$features/accounts/accounts.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: RecurringEditorSheetViewModel } = $props();

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
		<h3 class="sheet-title">{vm.isEditing ? m.recurring_edit_title() : m.recurring_add_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.label}
			/>
		</div>

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

		{#if vm.type === 'expense'}
			<div class="field">
				<span class="field-label">{m.label_category()}</span>
				<div class="cat-chips">
					{#each categoriesVM.categories as cat (cat.icon)}
						<button
							class="cat-chip"
							class:active={vm.icon === cat.icon}
							onclick={() => (vm.icon = cat.icon)}
						>
							<Icon name={cat.icon} size={16} />
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<div class="field">
			<span class="field-label">{m.transfer_amount()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.amount} size="lg" />
			</div>
		</div>

		<div class="field">
			<span class="field-label">{m.recurring_frequency()}</span>
			<Dropdown bind:value={vm.frequency} options={frequencyOptions} />
		</div>

		<div class="field">
			<span class="field-label">{m.recurring_account()}</span>
			<Dropdown bind:value={vm.accountId} options={accountOptions} />
		</div>

		<div class="field">
			<span class="field-label">{m.placeholder_note()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_note()}
				bind:value={vm.note}
			/>
		</div>

		<button class="btn-save" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_save()}
		</button>
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
		transition: border-color 0.2s ease;
	}
	.field-input::placeholder {
		color: var(--text-lo);
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
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

	.cat-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.cat-chip {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-lo);
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font);
	}
	.cat-chip.active {
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

	.btn-save {
		width: 100%;
		padding: 17px;
		border-radius: var(--r-md);
		border: 1px solid rgba(221, 232, 240, 0.25);
		background: rgba(221, 232, 240, 0.09);
		color: #ffffff;
		font-size: 17px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.22s ease;
		font-family: var(--font);
		cursor: pointer;
		box-shadow:
			inset 0 1px 0 rgba(221, 232, 240, 0.35),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			0 0 24px rgba(221, 232, 240, 0.12),
			0 6px 20px rgba(0, 0, 0, 0.35);
	}
	.btn-save:disabled {
		opacity: 0.22;
		cursor: not-allowed;
		box-shadow: none;
		border-color: var(--border);
	}
</style>
