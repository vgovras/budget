<script lang="ts">
	import { AlertDialog } from 'bits-ui';
	import type { ConfirmDialogViewModel } from './confirm-dialog.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: ConfirmDialogViewModel } = $props();
</script>

<AlertDialog.Root bind:open={vm.isOpen}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="confirm-overlay" />
		<AlertDialog.Content class="confirm-card">
			<AlertDialog.Title class="confirm-title">{vm.title}</AlertDialog.Title>
			<AlertDialog.Description class="confirm-msg">{vm.message}</AlertDialog.Description>
			<div class="confirm-btns">
				<AlertDialog.Cancel class="confirm-btn" onclick={() => vm.cancel()}>
					{m.button_cancel()}
				</AlertDialog.Cancel>
				<AlertDialog.Action
					class="confirm-btn {vm.okStyle === 'danger' ? 'danger' : ''}"
					onclick={() => vm.confirm()}
				>
					{vm.okLabel}
				</AlertDialog.Action>
			</div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>

<style>
	:global(.confirm-overlay) {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgba(0, 0, 0, 0.65);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global(.confirm-card) {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: calc(100% - 48px);
		max-width: 320px;
		background: rgba(14, 14, 18, 0.8);
		backdrop-filter: blur(24px) saturate(120%);
		-webkit-backdrop-filter: blur(24px) saturate(120%);
		border-radius: 24px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		padding: 24px 20px 16px;
		display: flex;
		flex-direction: column;
		gap: 8px;
		z-index: 41;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
	}

	:global(.confirm-title) {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.02em;
		text-align: center;
		color: var(--text-hi);
	}

	:global(.confirm-msg) {
		font-size: 14px;
		color: var(--text-mid);
		text-align: center;
		line-height: 1.5;
		padding: 0 4px;
	}

	.confirm-btns {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}

	:global(.confirm-btn) {
		flex: 1;
		padding: 13px;
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
	:global(.confirm-btn:hover) {
		background: rgba(255, 255, 255, 0.07);
	}
	:global(.confirm-btn.danger) {
		background: rgba(255, 80, 80, 0.08);
		border-color: rgba(255, 80, 80, 0.15);
		color: rgba(255, 100, 100, 0.85);
	}
	:global(.confirm-btn.danger:hover) {
		background: rgba(255, 70, 70, 0.2);
	}
</style>
