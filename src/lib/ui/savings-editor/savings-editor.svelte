<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import NumberInput from '$lib/ui/number-input/number-input.svelte';
	import Chip from '$lib/ui/chip/chip.svelte';
	import ProgressBar from '$lib/ui/progress-bar/progress-bar.svelte';
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

	const PRESETS = [0, 10, 20, 30, 50, 75];

	const dailyBudget = $derived(Math.floor(budget / 30));
	const barPercent = $derived(Math.min(100, savingsPercent));

	let pctValue = $state(savingsPercent);
	$effect(() => { pctValue = savingsPercent; });
	$effect(() => { onSetPercent(pctValue); });
</script>

<div class="flex flex-col gap-3.5">
	<NumberInput bind:value={pctValue} min={0} max={100} label={m.onboarding_savings_percentage()} suffix="%" />

	<div class="flex flex-wrap gap-2">
		{#each PRESETS as pct (pct)}
			<Chip active={savingsPercent === pct} onclick={() => onSetPercent(pct)}>
				{pct}%
			</Chip>
		{/each}
	</div>

	<div class="flex flex-col gap-2.5 p-3.5 bg-surface-3 border border-surface-7 rounded-2xl">
		<ProgressBar value={barPercent} variant="green" />
		<div class="flex justify-between items-center">
			<span class="text-sm text-text-mid font-light">{m.onboarding_savings_pill()}</span>
			<span class="text-sm text-success font-medium">{currency}{fmt(savingsAmount)}<span class="text-xs text-text-lo font-light">/{m.onboarding_per_month()}</span></span>
		</div>
		{#if subscriptionsTotal > 0}
			<div class="flex justify-between items-center">
				<span class="text-sm text-text-mid font-light">{m.sub_section_title()}</span>
				<span class="text-sm text-warning font-medium">{currency}{fmt(subscriptionsTotal)}<span class="text-xs text-text-lo font-light">/{m.onboarding_per_month()}</span></span>
			</div>
		{/if}
		<div class="flex justify-between items-center">
			<span class="text-sm text-text-mid font-light">{m.onboarding_remaining_for_expenses()}</span>
			<span class="text-sm text-text-hi font-medium">{currency}{fmt(budget)} <span class="text-xs text-text-lo font-light">≈ {currency}{fmt(dailyBudget)}/{m.home_days_short()}</span></span>
		</div>
	</div>
</div>
