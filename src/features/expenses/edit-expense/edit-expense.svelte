<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import type { EditExpenseViewModel } from './edit-expense.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: EditExpenseViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="flex flex-col gap-4">
		<div class="text-[11px] font-medium tracking-[1.4px] uppercase text-[rgba(255,255,255,0.25)] text-center">
			{vm.title}
		</div>

		<div class="amount-field">
			<MoneyInput bind:value={vm.amount} currency={vm.displayCurrency} size="lg" autofocus={vm.isOpen} />
		</div>

		<input class="note-field" type="text" placeholder={m.placeholder_note()} bind:value={vm.note} />

		<div class="flex gap-2.5">
			<Button variant="destructive" size="md" class="flex-1" onclick={() => vm.delete()}>
				{m.button_undo_transaction()}
			</Button>
			<Button variant="accent" size="md" class="flex-1" onclick={() => vm.save()}>
				{m.button_save()}
			</Button>
		</div>
	</div>
</BottomSheet>

<style>
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
		padding: 12px 16px;
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
</style>
