<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import type { EditExpenseViewModel } from './edit-expense.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: EditExpenseViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<div class="edit-title">{vm.title}</div>

		<div class="amount-field">
			<MoneyInput bind:value={vm.amount} size="lg" autofocus={vm.isOpen} />
		</div>

		<input class="note-field" type="text" placeholder={m.placeholder_note()} bind:value={vm.note} />

		<div class="edit-actions">
			<button class="edit-btn danger" onclick={() => vm.delete()}>{m.button_delete()}</button>
			<button class="edit-btn save" onclick={() => vm.save()}>{m.button_save()}</button>
		</div>
	</div>
</BottomSheet>

<style>
	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.edit-title {
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.25);
		text-align: center;
	}

	.amount-field {
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: var(--r-md);
		transition: all 0.2s ease;
	}
	.amount-field:focus-within {
		border-color: rgba(255, 255, 255, 0.16);
	}

	.note-field {
		padding: 13px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.03);
		font-size: 15px;
		width: 100%;
		transition: all 0.2s ease;
		color: var(--text-hi);
		font-family: var(--font);
	}
	.note-field::placeholder {
		color: var(--text-lo);
	}
	.note-field:focus {
		border-color: rgba(255, 255, 255, 0.16);
		outline: none;
	}

	.edit-actions {
		display: flex;
		gap: 10px;
	}

	.edit-btn {
		flex: 1;
		padding: 14px;
		border-radius: var(--r-md);
		border: 1px solid rgba(255, 255, 255, 0.07);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-hi);
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font);
		transition: all 0.15s ease;
	}
	.edit-btn:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.edit-btn.danger {
		color: rgba(255, 100, 100, 0.75);
		border-color: rgba(255, 100, 100, 0.2);
	}
	.edit-btn.danger:hover {
		background: rgba(255, 100, 100, 0.08);
	}

	.edit-btn.save {
		background: rgba(80, 130, 255, 0.08);
		border-color: rgba(80, 130, 255, 0.25);
		color: rgba(80, 130, 255, 0.7);
	}
	.edit-btn.save:hover {
		background: rgba(80, 130, 255, 0.14);
	}
</style>
