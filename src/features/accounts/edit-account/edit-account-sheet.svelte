<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import Toggle from '$lib/ui/toggle/toggle.svelte';
	import type { EditAccountSheetViewModel } from './edit-account-sheet.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm, onDelete }: { vm: EditAccountSheetViewModel; onDelete?: (id: string, name: string) => void } = $props();

	const currency = $derived(vm.account?.currency ?? settingsVM.currency);
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{m.edit_account_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input class="field-input" type="text" bind:value={vm.name} />
		</div>

		<div class="field">
			<span class="field-label">{m.account_balance()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.balance} {currency} />
			</div>
		</div>

		<div class="primary-row" onclick={() => vm.togglePrimary()}>
			<div class="primary-info">
				<Icon name="star" size={16} />
				<span>{m.label_primary_account()}</span>
			</div>
			<Toggle checked={vm.isPrimary} />
		</div>

		<div class="flex gap-2.5">
			<Button variant="destructive" size="lg" class="flex-1 gap-2" onclick={() => { vm.close(); onDelete?.(vm.accountId, vm.name); }}>
				<Icon name="trash" size={16} />
				{m.button_delete()}
			</Button>
			<Button variant="soft" size="lg" class="flex-1" disabled={!vm.canSave} onclick={() => vm.save()}>
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
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.amount-field {
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-sm);
	}
	.amount-field:focus-within {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.primary-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
		cursor: pointer;
	}
	.primary-info {
		display: flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		color: rgba(255, 255, 255, 0.6);
	}
</style>
