<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import SheetForm from '$lib/ui/sheet-form/sheet-form.svelte';
	import FormField from '$lib/ui/form-field/form-field.svelte';
	import IconPicker from '$lib/ui/icon-picker/icon-picker.svelte';
	import type { CategoryEditorSheetViewModel } from './category-editor-sheet.svelte.js';
	import { CAT_COLOR_PRESETS, CAT_ICON_PRESETS } from '$lib/constants.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm }: { vm: CategoryEditorSheetViewModel } = $props();
</script>

<BottomSheet bind:open={vm.isOpen}>
	<SheetForm title={vm.isEditing ? m.category_edit_title() : m.category_add_title()}>
		<FormField label={m.field_label_name()}>
			<input
				class="field-input"
				type="text"
				placeholder={m.placeholder_enter_name()}
				bind:value={vm.label}
			/>
		</FormField>

		<FormField label={m.category_icon_label()}>
			<IconPicker
				icons={CAT_ICON_PRESETS}
				selected={vm.icon}
				onSelect={(ico) => (vm.icon = ico)}
				activeBg={vm.bg}
				activeBorder={vm.border}
			/>
		</FormField>

		<FormField label={m.category_color_label()}>
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
		</FormField>

		{#if vm.categoryType === 'income'}
			<FormField label={m.category_commission_label()} hint={m.category_commission_hint()}>
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
			</FormField>
		{/if}

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_save()}
		</Button>
	</SheetForm>
</BottomSheet>

<style>
	.field-input {
		padding: 12px 16px;
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
