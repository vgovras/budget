<script lang="ts">
	import type { EditExpenseViewModel } from './edit-expense.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: EditExpenseViewModel } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="edit-modal" class:open={vm.isOpen} onclick={() => vm.close()}>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="edit-card" onclick={(e) => e.stopPropagation()}>
		<div class="edit-title">{vm.title}</div>
		<div class="amount-field">
			<span class="amount-currency">₴</span>
			<input
				class="amount-input"
				type="number"
				inputmode="decimal"
				placeholder="0"
				bind:value={vm.amount}
			/>
		</div>
		<input class="note-field" type="text" placeholder={m.placeholder_note()} bind:value={vm.note} />
		<div class="edit-actions">
			<button class="edit-btn danger" onclick={() => vm.delete()}>{m.button_delete()}</button>
			<button class="edit-btn cancel" onclick={() => vm.close()}>{m.button_cancel()}</button>
			<button class="edit-btn save" onclick={() => vm.save()}>{m.button_save()}</button>
		</div>
	</div>
</div>

<style>
	.edit-modal {
		position: fixed;
		inset: 0;
		z-index: 30;
		background: rgba(0, 0, 0, 0.65);
		display: flex;
		align-items: flex-end;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.25s ease;
	}

	.edit-modal.open {
		opacity: 1;
		pointer-events: all;
	}

	.edit-card {
		width: 100%;
		padding: 20px 20px 36px;
		background: rgba(16, 16, 20, 0.97);
		border-radius: 28px 28px 0 0;
		border: 1px solid var(--border-hi);
		border-bottom: none;
		display: flex;
		flex-direction: column;
		gap: 14px;
		transform: translateY(16px);
		transition: transform 0.3s var(--ease-out);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 -4px 40px rgba(0, 0, 0, 0.4);
	}

	.edit-modal.open .edit-card {
		transform: translateY(0);
	}

	.edit-title {
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-lo);
		text-align: center;
	}

	.amount-field {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-md);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			inset 0 -1px 0 rgba(0, 0, 0, 0.15),
			0 2px 12px rgba(0, 0, 0, 0.2);
	}

	.amount-currency {
		font-family: var(--font-mono);
		font-size: 28px;
		font-weight: 300;
		color: var(--text-lo);
	}

	.amount-input {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 40px;
		font-weight: 300;
		letter-spacing: -0.03em;
		width: 100%;
		caret-color: var(--accent);
		color: var(--text-hi);
		background: none;
		border: none;
		outline: none;
	}

	.note-field {
		padding: 13px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 15px;
		width: 100%;
		transition: all 0.2s ease;
		color: var(--text-hi);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.12);
		font-family: var(--font);
	}
	.note-field::placeholder {
		color: var(--text-mid);
	}
	.note-field:focus {
		border-color: rgba(255, 255, 255, 0.18);
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
		border: 1px solid var(--border);
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
		color: rgba(255, 80, 80, 0.85);
		border-color: rgba(255, 80, 80, 0.2);
	}
	.edit-btn.danger:hover {
		background: rgba(255, 80, 80, 0.08);
	}

	.edit-btn.cancel {
		color: var(--text-mid);
	}

	.edit-btn.save {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.14);
		color: var(--text-hi);
	}
	.edit-btn.save:hover {
		background: rgba(255, 255, 255, 0.12);
	}
</style>
