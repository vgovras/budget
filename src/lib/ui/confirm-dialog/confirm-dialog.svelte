<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import type { ConfirmDialogViewModel } from './confirm-dialog.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: ConfirmDialogViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="confirm-body">
		<div class="confirm-title">{vm.title}</div>
		{#if vm.message}
			<div class="confirm-msg">{vm.message}</div>
		{/if}
		<div class="confirm-btns">
			<button class="confirm-btn" onclick={() => vm.cancel()}>
				{m.button_cancel()}
			</button>
			<button
				class="confirm-btn {vm.okStyle === 'danger' ? 'danger' : 'primary'}"
				onclick={() => vm.confirm()}
			>
				{vm.okLabel}
			</button>
		</div>
	</div>
</BottomSheet>

<style>
	.confirm-body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		text-align: center;
	}

	.confirm-title {
		font-size: 18px;
		font-weight: 600;
		letter-spacing: -0.02em;
		color: var(--text-hi);
	}

	.confirm-msg {
		font-size: 14px;
		color: var(--text-mid);
		line-height: 1.5;
		padding: 0 8px;
	}

	.confirm-btns {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}

	.confirm-btn {
		flex: 1;
		padding: 15px;
		border-radius: var(--r-md);
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-hi);
		font-size: 15px;
		font-weight: 500;
		cursor: pointer;
		font-family: var(--font);
		transition: all 0.15s ease;
	}
	.confirm-btn:hover {
		background: rgba(255, 255, 255, 0.07);
	}
	.confirm-btn.danger {
		background: var(--danger-bg);
		border-color: var(--danger-border);
		color: var(--danger);
	}
	.confirm-btn.danger:hover {
		background: rgba(255, 107, 107, 0.16);
	}
	.confirm-btn.primary {
		background: rgba(221, 232, 240, 0.09);
		border-color: rgba(221, 232, 240, 0.25);
		color: #fff;
	}
	.confirm-btn.primary:hover {
		background: rgba(221, 232, 240, 0.14);
	}
</style>
