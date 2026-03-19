<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import type { SettingsInputModalViewModel } from './settings-input-modal.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: SettingsInputModalViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="settings-input-title">{vm.config.title}</div>
	<div class="settings-number-input">
		{#if vm.config.currency}
			<span class="settings-input-cur">{vm.currencySymbol}</span>
		{/if}
		{#if vm.config.isText}
			<input
				class="settings-input-field"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.value}
			/>
		{:else}
			<input
				class="settings-input-field"
				type="number"
				inputmode="decimal"
				placeholder="0"
				bind:value={vm.value}
			/>
		{/if}
	</div>
	{#if vm.config.subtitle}
		<div class="settings-input-sub">{vm.config.subtitle}</div>
	{/if}
	<Button variant="default" size="lg" onclick={() => vm.save()}>{m.button_save()}</Button>
</BottomSheet>

<style>
	.settings-input-title {
		font-size: 17px;
		font-weight: 600;
		letter-spacing: -0.02em;
		text-align: center;
		color: var(--text-hi);
	}

	.settings-number-input {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 12px 16px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-sm);
	}

	.settings-input-cur {
		font-family: var(--font-mono);
		font-size: 24px;
		font-weight: 300;
		color: var(--text-lo);
	}

	.settings-input-field {
		flex: 1;
		font-family: var(--font-mono);
		font-size: 32px;
		font-weight: 300;
		letter-spacing: -0.03em;
		width: 100%;
		caret-color: var(--accent);
		color: var(--text-hi);
		background: none;
		border: none;
		outline: none;
	}

	.settings-input-sub {
		font-size: 13px;
		color: var(--text-lo);
		text-align: center;
	}

</style>
