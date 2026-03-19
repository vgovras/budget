<script lang="ts">
	import BottomSheet from '$lib/ui/bottom-sheet/bottom-sheet.svelte';
	import Button from '$lib/ui/button/button.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { EditAccountSheetViewModel } from './edit-account-sheet.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { vm, onDelete }: { vm: EditAccountSheetViewModel; onDelete?: (id: string, name: string) => void } = $props();

	const currency = $derived(vm.account?.currency ?? settingsVM.currency);
</script>

<BottomSheet bind:open={vm.isOpen}>
	<div class="sheet-body">
		<h3 class="sheet-title">{m.edit_account_title()}</h3>

		<div class="field">
			<span class="field-label">{m.field_label_name()}</span>
			<input class="field-input" type="text" bind:value={vm.name} />
		</div>

		<div class="field">
			<span class="field-label">{m.account_balance()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.balance} {currency} />
			</div>
		</div>

		<div class="field">
			<span class="field-label">{m.account_budget_label()}</span>
			<div class="amount-field">
				<MoneyInput bind:value={vm.budget} {currency} />
			</div>
		</div>

		{#if vm.isMain && settingsVM.salary > 0}
			<div class="field">
				<span class="field-label">{m.onboarding_savings_pill()} ({vm.currentSavingsPercent}%)</span>
				<div class="track">
					<div class="track-fill" style="width:{vm.sliderPosition}%"></div>
					{#each vm.displaySteps as step, i (step.pct)}
						<!-- svelte-ignore a11y_click_events_have_key_events -->
						<!-- svelte-ignore a11y_no_static_element_interactions -->
						<div
							class="stop"
							class:reached={vm.sliderPosition >= step.pos}
							class:active={Math.abs(vm.sliderPosition - step.pos) < 1}
							style="left:{step.pos}%"
							onclick={() => vm.setSavingsIdx(i)}
						>
							<div class="stop-dot"></div>
							<span class="stop-label">{step.label}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if vm.account?.type === 'savings'}
			<div class="field">
				<span class="field-label">{m.goal_amount_label()}</span>
				<div class="amount-field">
					<MoneyInput bind:value={vm.goalAmount} {currency} />
				</div>
			</div>
		{/if}

		<Button variant="soft" size="lg" disabled={!vm.canSave} onclick={() => vm.save()}>
			{m.button_save()}
		</Button>

		{#if !vm.isMain}
			<Button variant="destructive" size="lg" class="gap-2" onclick={() => { vm.close(); onDelete?.(vm.accountId, vm.name); }}>
				<Icon name="trash" size={16} />
				{m.button_delete()}
			</Button>
		{/if}
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
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 16px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
	}
	.field-input:focus {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.amount-field {
		padding: 10px 14px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-sm);
	}
	.amount-field:focus-within {
		border-color: rgba(221, 232, 240, 0.28);
	}

	.track {
		position: relative;
		height: 4px;
		background: rgba(255,255,255,0.08);
		border-radius: 99px;
		margin: 16px 8px 28px;
	}

	.track-fill {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		border-radius: 99px;
		background: rgba(80,200,120,0.6);
		transition: width 0.25s ease;
	}

	.stop {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		cursor: pointer;
		z-index: 1;
	}

	.stop-dot {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: rgba(255,255,255,0.06);
		border: 2px solid rgba(255,255,255,0.12);
		transition: all 0.2s ease;
	}

	.stop.reached .stop-dot {
		background: rgba(80,200,120,0.3);
		border-color: rgba(80,200,120,0.5);
	}

	.stop.active .stop-dot {
		background: rgba(80,200,120,0.9);
		border-color: rgba(80,200,120,1);
		box-shadow: 0 0 10px rgba(80,200,120,0.4);
	}

	.stop-label {
		position: absolute;
		top: 22px;
		font-size: 10px;
		color: rgba(255,255,255,0.2);
		font-weight: 300;
		white-space: nowrap;
	}

	.stop.active .stop-label {
		color: rgba(80,200,120,0.85);
		font-weight: 500;
	}

	.savings-summary {
		font-size: 12px;
		color: rgba(255,255,255,0.35);
		text-align: center;
	}
</style>
