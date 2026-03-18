<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { CategoryEditorSheetViewModel } from './category-editor-sheet.svelte.js';
	import { CAT_COLOR_PRESETS, CAT_ICON_PRESETS } from '$lib/constants.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: CategoryEditorSheetViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{vm.isEditing ? m.category_edit_title() : m.category_add_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.label}
			/>
		</div>

		<div class="field">
			<span class="field-label">{m.category_icon_label()}</span>
			<div class="icon-grid">
				{#each CAT_ICON_PRESETS as ico (ico)}
					<button
						class="icon-btn"
						class:active={vm.icon === ico}
						style:background={vm.icon === ico ? vm.bg : ''}
						style:border-color={vm.icon === ico ? vm.border : ''}
						onclick={() => (vm.icon = ico)}
					>
						<Icon name={ico} size={18} />
					</button>
				{/each}
			</div>
		</div>

		<div class="field">
			<span class="field-label">{m.category_color_label()}</span>
			<div class="color-row">
				{#each CAT_COLOR_PRESETS as preset, i (i)}
					<button
						class="color-dot"
						class:active={vm.bg === preset.bg}
						style:background={preset.bg}
						style:border-color={preset.border}
						onclick={() => vm.setColor(preset.bg, preset.border)}
					></button>
				{/each}
			</div>
		</div>

		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="advanced-toggle" onclick={() => (vm.showAdvanced = !vm.showAdvanced)}>
			<Icon name={vm.showAdvanced ? 'chevron-down' : 'chevron-right'} size={16} />
			<span>{m.category_advanced()}</span>
		</div>

		{#if vm.showAdvanced}
			<div class="field">
				<span class="field-label">{m.category_commission_label()}</span>
				<div class="commission-row">
					<input
						class="field-input commission-input"
						type="number"
						min="0"
						max="100"
						bind:value={vm.commission}
					/>
					<span class="commission-pct">%</span>
				</div>
				<span class="field-hint">{m.category_commission_hint()}</span>
			</div>
		{/if}

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_save()}
		</Button>
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
	.field-input::placeholder {
		color: var(--text-lo);
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.field-hint {
		font-size: 11px;
		color: var(--text-lo);
		padding-left: 2px;
	}

	.icon-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
		max-height: 160px;
		overflow-y: auto;
		scrollbar-width: none;
	}
	.icon-grid::-webkit-scrollbar {
		display: none;
	}

	.icon-btn {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-lo);
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font);
	}
	.icon-btn.active {
		color: var(--text-hi);
	}

	.color-row {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
	}

	.color-dot {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.color-dot.active {
		box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px rgba(255, 255, 255, 0.3);
	}

	.advanced-toggle {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		color: var(--text-mid);
		cursor: pointer;
		padding: 4px 0;
	}

	.commission-row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.commission-input {
		width: 100px;
	}

	.commission-pct {
		font-size: 16px;
		color: var(--text-mid);
	}

</style>
