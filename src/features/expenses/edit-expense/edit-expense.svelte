<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import AmountField from '$lib/ui/amount-field/amount-field.svelte';
	import SheetActions from '$lib/ui/sheet-actions/sheet-actions.svelte';
	import DatePicker from '$lib/ui/date-picker/date-picker.svelte';
	import type { EditExpenseViewModel } from './edit-expense.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: EditExpenseViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="flex flex-col gap-4">
		<div class="text-[11px] font-medium tracking-[1.4px] uppercase text-[var(--text-lo)] text-center">
			{vm.title}
		</div>

		<AmountField>
			<MoneyInput bind:value={vm.amount} currency={vm.displayCurrency} size="lg" autofocus={vm.isOpen} />
		</AmountField>

		<input class="note-field" type="text" placeholder={m.placeholder_note()} bind:value={vm.note} />

		<DatePicker bind:value={vm.editDate} />

		<SheetActions>
			<Button variant="destructive" size="md" class="flex-1" onclick={() => vm.delete()}>
				{m.button_undo_transaction()}
			</Button>
			<Button variant="accent" size="md" class="flex-1" onclick={() => vm.save()}>
				{m.button_save()}
			</Button>
		</SheetActions>
	</div>
</BottomSheet>

<style>
	.note-field {
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid var(--border);
		background: var(--surface-3);
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
		border-color: var(--surface-16);
		outline: none;
	}
</style>
