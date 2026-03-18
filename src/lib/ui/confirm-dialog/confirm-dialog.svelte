<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import type { ConfirmDialogViewModel } from './confirm-dialog.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: ConfirmDialogViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="flex flex-col gap-3 text-center">
		<div class="text-lg font-semibold tracking-tight text-text-hi">{vm.title}</div>
		{#if vm.message}
			<div class="text-sm text-text-mid leading-relaxed px-2">{vm.message}</div>
		{/if}
		<div class="flex gap-2 mt-1">
			<Button variant="secondary" size="md" class="flex-1" onclick={() => vm.cancel()}>
				{m.button_cancel()}
			</Button>
			<Button
				variant={vm.okStyle === 'danger' ? 'destructive' : 'soft'}
				size="md"
				class="flex-1"
				onclick={() => vm.confirm()}
			>
				{vm.okLabel}
			</Button>
		</div>
	</div>
</BottomSheet>
