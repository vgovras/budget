<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		salary,
		steps,
		activeIdx,
		savingsAmount,
		onSelectIdx,
		onCustom,
		onNext
	}: {
		salary: number;
		steps: number[];
		activeIdx: number | null;
		savingsAmount: number;
		onSelectIdx: (idx: number) => void;
		onCustom: (amount: number | null) => void;
		onNext: () => void;
	} = $props();

	let localAmount = $state<number | null>(savingsAmount || null);
	let fromSlider = false;

	const budgetAmount = $derived(salary - savingsAmount);
	const dailyAmount = $derived(Math.round(budgetAmount / 30));
	const fillPct = $derived(activeIdx !== null ? (activeIdx / (steps.length - 1)) * 100 : 0);

	// Sync from VM when slider changes
	$effect(() => {
		if (activeIdx !== null) {
			fromSlider = true;
			localAmount = savingsAmount || null;
		}
	});

	// Push input changes to VM
	$effect(() => {
		// Read localAmount to track it
		const val = localAmount;
		if (fromSlider) {
			fromSlider = false;
			return;
		}
		onCustom(val);
	});
</script>

<div class="step">
	<div class="step-icon"><Icon name="piggy-bank" size={48} /></div>
	<h2 class="step-title">{m.onboarding_savings_title()}</h2>

	<div class="amount-display">
		<MoneyInput bind:value={localAmount} size="xl" />
		<span class="amount-label">{m.onboarding_per_month()}</span>
	</div>

	<div class="slider-wrap">
		<div class="slider-track">
			<div class="slider-fill" style="width:{fillPct}%"></div>
			{#each steps as pct, i (pct)}
				<button
					class="slider-stop"
					class:active={activeIdx !== null && i <= activeIdx}
					class:current={i === activeIdx}
					style="left:{(i / (steps.length - 1)) * 100}%"
					onclick={() => onSelectIdx(i)}
					aria-label="{pct}%"
				>
					<span class="stop-dot"></span>
				</button>
			{/each}
		</div>
		<div class="slider-labels">
			{#each steps as pct, i (pct)}
				<button
					class="slider-label"
					class:active={i === activeIdx}
					style="left:{(i / (steps.length - 1)) * 100}%"
					onclick={() => onSelectIdx(i)}
				>
					{pct}%
				</button>
			{/each}
		</div>
	</div>

	<div class="budget-hint">
		{m.onboarding_remaining_for_expenses()} <strong>₴{fmt(budgetAmount)}</strong>
	</div>
	<div class="budget-hint daily">
		≈ <strong>₴{fmt(dailyAmount)}</strong>
		{m.home_per_day()}
	</div>

	<button class="step-btn" onclick={onNext}>{m.button_next()}</button>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
		padding: 40px 24px;
		text-align: center;
		height: 100%;
		width: 100%;
	}
	.step-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-mid);
	}
	.step-title {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}

	/* Amount display */
	.amount-display {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}
	.amount-label {
		font-size: 13px;
		color: var(--text-lo);
	}

	/* Slider */
	.slider-wrap {
		width: 100%;
		max-width: 320px;
		padding: 0 16px;
		position: relative;
	}

	.slider-track {
		position: relative;
		height: 4px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 99px;
		margin: 20px 0;
	}

	.slider-fill {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.35);
		border-radius: 99px;
		transition: width 0.25s ease;
	}

	.slider-stop {
		position: absolute;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 32px;
		height: 32px;
		border: none;
		background: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
	}

	.stop-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.12);
		border: 2px solid rgba(255, 255, 255, 0.08);
		transition: all 0.25s ease;
	}

	.slider-stop.active .stop-dot {
		background: rgba(255, 255, 255, 0.35);
		border-color: rgba(255, 255, 255, 0.15);
	}

	.slider-stop.current .stop-dot {
		width: 20px;
		height: 20px;
		background: rgba(255, 255, 255, 0.8);
		border-color: rgba(255, 255, 255, 0.3);
		box-shadow: 0 0 12px rgba(255, 255, 255, 0.15);
	}

	/* Labels */
	.slider-labels {
		position: relative;
		height: 24px;
		margin-top: 4px;
	}

	.slider-label {
		position: absolute;
		transform: translateX(-50%);
		font-family: var(--font-mono);
		font-size: 12px;
		font-weight: 500;
		color: var(--text-lo);
		background: none;
		border: none;
		cursor: pointer;
		padding: 2px 4px;
		transition: all 0.2s ease;
	}

	.slider-label.active {
		color: var(--text-hi);
		font-weight: 600;
	}

	/* Budget hint */
	.budget-hint {
		font-size: 14px;
		color: var(--text-lo);
		margin-top: 4px;
	}
	.budget-hint.daily {
		margin-top: 0;
	}
	.budget-hint :global(strong) {
		color: var(--text-mid);
		font-weight: 600;
	}

	.step-btn {
		margin-top: 8px;
		padding: 16px 48px;
		border-radius: var(--r-md);
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
		font-size: 17px;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font);
		transition: all 0.2s ease;
	}
	.step-btn:hover {
		background: rgba(255, 255, 255, 0.12);
	}
</style>
