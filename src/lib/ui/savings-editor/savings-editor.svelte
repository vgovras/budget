<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import NumberInput from '$lib/ui/number-input/number-input.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		savingsPercent,
		savingsAmount,
		subscriptionsTotal = 0,
		budget,
		currency,
		onSetPercent
	}: {
		savingsPercent: number;
		savingsAmount: number;
		subscriptionsTotal?: number;
		budget: number;
		currency: string;
		onSetPercent: (pct: number) => void;
	} = $props();

	const PRESETS = [0, 5, 10, 20, 30, 50, 75];

	const dailyBudget = $derived(Math.floor(budget / 30));
	const barPercent = $derived(Math.min(100, savingsPercent));

	let pctValue = $state(savingsPercent);
	$effect(() => { pctValue = savingsPercent; });
	$effect(() => { onSetPercent(pctValue); });
</script>

<div class="savings-editor">
	<NumberInput bind:value={pctValue} min={0} max={100} label={m.onboarding_savings_percentage()} suffix="%" />

	<div class="presets">
		{#each PRESETS as pct (pct)}
			<button
				class="preset-chip"
				class:active={savingsPercent === pct}
				onclick={() => onSetPercent(pct)}
			>
				{pct}%
			</button>
		{/each}
	</div>

	<div class="summary">
		<div class="bar-wrap">
			<div class="bar-fill" style="width:{barPercent}%"></div>
		</div>
		<div class="summary-row">
			<span class="summary-label">{m.onboarding_savings_pill()}</span>
			<span class="summary-val green">{currency}{fmt(savingsAmount)}<span class="dim">/{m.onboarding_per_month()}</span></span>
		</div>
		{#if subscriptionsTotal > 0}
			<div class="summary-row">
				<span class="summary-label">{m.sub_section_title()}</span>
				<span class="summary-val sub">{currency}{fmt(subscriptionsTotal)}<span class="dim">/{m.onboarding_per_month()}</span></span>
			</div>
		{/if}
		<div class="summary-row">
			<span class="summary-label">{m.onboarding_remaining_for_expenses()}</span>
			<span class="summary-val">{currency}{fmt(budget)} <span class="dim">≈ {currency}{fmt(dailyBudget)}/{m.home_days_short()}</span></span>
		</div>
	</div>
</div>

<style>
	.savings-editor {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.presets {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.preset-chip {
		padding: 8px 16px;
		border-radius: 12px;
		border: 1px solid rgba(255,255,255,0.08);
		background: rgba(255,255,255,0.04);
		color: rgba(255,255,255,0.5);
		font-size: 14px;
		font-weight: 500;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.preset-chip:active {
		transform: scale(0.96);
	}
	.preset-chip.active {
		background: rgba(80,200,120,0.15);
		border-color: rgba(80,200,120,0.4);
		color: rgba(80,200,120,0.9);
	}

	.summary {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 14px;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 16px;
	}
	.bar-wrap {
		height: 6px;
		background: rgba(255,255,255,0.06);
		border-radius: 99px;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		border-radius: 99px;
		background: rgba(80,200,120,0.6);
		transition: width 0.3s ease;
	}
	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.summary-label {
		font-size: 13px;
		color: rgba(255,255,255,0.35);
		font-weight: 300;
	}
	.summary-val {
		font-size: 14px;
		color: rgba(255,255,255,0.8);
		font-weight: 500;
	}
	.summary-val.green {
		color: rgba(80,200,120,0.85);
	}
	.summary-val.sub {
		color: rgba(255,140,80,0.85);
	}
	.dim {
		font-size: 11px;
		color: rgba(255,255,255,0.25);
		font-weight: 300;
	}
</style>
