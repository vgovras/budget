<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { EditAccountSheetViewModel } from './edit-account-sheet.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm, onDelete }: { vm: EditAccountSheetViewModel; onDelete?: (id: string, name: string) => void } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{m.edit_account_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input
				class="field-input"
				type="text"
				bind:value={vm.name}
			/>
		</div>

		<div class="field">
			<span class="field-label">{m.account_balance()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.balance} currency={vm.account?.currency ?? settingsVM.currency} size="lg" />
			</div>
		</div>

		<div class="field">
			<span class="field-label">{m.account_budget_label()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.budget} currency={vm.account?.currency ?? settingsVM.currency} size="lg" />
			</div>
		</div>

		{#if vm.account?.type === 'savings'}
			<div class="field">
				<span class="field-label">{m.goal_amount_label()}</span>
				<div class="amount-field">
					<MoneyInput bind:value={vm.goalAmount} currency={vm.account?.currency ?? settingsVM.currency} />
				</div>
			</div>
		{/if}

		<button class="btn-save" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_save()}
		</button>

		<button class="btn-delete" onclick={() => { vm.close(); onDelete?.(vm.accountId, vm.name); }}>
			<Icon name="trash" size={16} />
			{m.button_delete()}
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
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
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

	.btn-delete {
		width: 100%;
		padding: 14px;
		border-radius: var(--r-md);
		border: 1px solid var(--danger-border);
		background: var(--danger-bg);
		color: var(--danger);
		font-size: 15px;
		font-weight: 500;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		transition: all 0.2s ease;
		font-family: var(--font);
		cursor: pointer;
	}
	.btn-delete:hover {
		background: rgba(255, 100, 100, 0.12);
	}
</style>
