<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import { fade } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';

	let {
		spentAmount,
		totalBudget,
		spentPercent,
		daysLeft,
		monthLabel,
		currency,
		onEdit
	}: {
		spentAmount: number;
		totalBudget: number;
		spentPercent: number;
		daysLeft: number;
		monthLabel: string;
		currency: string;
		onEdit?: () => void;
	} = $props();
</script>

<div class="bg-card-alt rounded-[22px] border border-border p-4.5 relative overflow-hidden" in:fade={{ duration: 300 }}>
	<div class="glow-1"></div>
	<div class="glow-2"></div>

	<div class="flex justify-between items-start mb-3.5 relative">
		<div>
			<div class="text-2xs tracking-[1.3px] uppercase text-text-muted font-medium">{m.home_spent_label()}</div>
			<div class="text-xs text-text-mid font-light mt-[3px]">{monthLabel}</div>
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="text-xs text-accent-dim px-2 py-1 bg-accent-bg border border-accent-glow rounded-lg cursor-pointer"
			onclick={onEdit}
		>{m.home_edit_button()}</div>
	</div>

	<div class="flex items-baseline gap-1.5 mb-3.5 relative">
		<span class="text-base font-light opacity-40 text-white">{currency}</span>
		<span class="text-[28px] font-medium text-white tracking-tight">{fmt(spentAmount)}</span>
		<span class="text-sm text-text-mid font-light">{m.account_of()}</span>
		<span class="text-sm text-text-secondary">{currency} {fmt(totalBudget)}</span>
	</div>

	<div class="flex justify-between text-xs text-text-muted mb-[7px]">
		<span>{currency} {fmt(spentAmount)} {m.home_spent_label().toLowerCase()}</span>
		<span>{spentPercent}% · {daysLeft} {m.home_days_short()} залишилось</span>
	</div>

	<div class="w-full h-[3px] bg-border rounded-sm relative">
		<div class="prog-fill" style="width:{Math.min(spentPercent, 100)}%">
			{#if spentPercent > 0}
				<div class="prog-dot"></div>
			{/if}
		</div>
	</div>
</div>

<style>
	.glow-1 {
		position: absolute;
		width: 200px;
		height: 180px;
		left: -50px;
		top: -60px;
		pointer-events: none;
		background: radial-gradient(ellipse, rgba(60, 100, 220, 0.16) 0%, transparent 70%);
		animation: glow-pulse 5s ease-in-out infinite;
	}
	.glow-2 {
		position: absolute;
		width: 160px;
		height: 140px;
		right: -20px;
		bottom: -30px;
		pointer-events: none;
		background: radial-gradient(ellipse, rgba(120, 50, 200, 0.12) 0%, transparent 70%);
		animation: glow-pulse 5s ease-in-out infinite 2.5s;
	}
	.prog-fill {
		height: 100%;
		border-radius: 2px;
		position: relative;
		background: var(--accent-dim);
		transition: width 1s ease;
	}
	.prog-dot {
		position: absolute;
		right: -4px;
		top: 50%;
		transform: translateY(-50%);
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 6px var(--accent-glow);
	}
</style>
