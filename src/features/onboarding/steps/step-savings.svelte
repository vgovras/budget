<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import { fmt } from '$lib/utils/format.js';
	import { convert } from '$lib/utils/currency.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		salary,
		currency = '₴',
		fiatViewEnabled = false,
		fiatCurrency = '₴',
		steps,
		activeIdx,
		savingsAmount,
		budget,
		onSelectIdx,
		onNext
	}: {
		salary: number;
		currency?: string;
		fiatViewEnabled?: boolean;
		fiatCurrency?: string;
		steps: number[];
		activeIdx: number | null;
		savingsAmount: number;
		budget: number;
		onSelectIdx: (idx: number) => void;
		onNext: () => void;
	} = $props();

	const isFiat = $derived(fiatViewEnabled && fiatCurrency !== currency);
	const cur = $derived(isFiat ? fiatCurrency : currency);

	function toDisplay(amount: number): number {
		return isFiat ? convert(amount, currency, fiatCurrency) : amount;
	}

	const dailyBudget = $derived(Math.floor(toDisplay(budget) / 30));

	let trackEl: HTMLElement;

	function idxFromX(clientX: number) {
		if (!trackEl) return 0;
		const rect = trackEl.getBoundingClientRect();
		const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
		const ratio = x / rect.width;
		return Math.round(ratio * (steps.length - 1));
	}

	function onTrackTouch(e: TouchEvent) {
		e.preventDefault();
		onSelectIdx(idxFromX(e.touches[0].clientX));
	}

	function onTrackClick(e: MouseEvent) {
		onSelectIdx(idxFromX(e.clientX));
	}

	// Donut proportions: Food (blue) + Transport (purple) + Savings (green)
	const savingsPct = $derived(salary > 0 ? savingsAmount / salary : 0);
	const expensesPct = $derived(1 - savingsPct);
	const foodPct = $derived(expensesPct * 0.55);
	const transportPct = $derived(expensesPct * 0.45);
	const circ = 2 * Math.PI * 38;
	const foodDash = $derived(foodPct * circ);
	const transportDash = $derived(transportPct * circ);
	const savingsDash = $derived(savingsPct * circ);
</script>

<div class="slide">
	<div class="visual">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="ill">
			<svg width="100" height="100" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="9"/>
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(74,127,255,0.75)" stroke-width="9"
					stroke-dasharray="{foodDash} {circ}" stroke-dashoffset="0"
					stroke-linecap="round" transform="rotate(-90 50 50)"
					style="transition: stroke-dasharray 0.4s ease"/>
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(123,79,255,0.7)" stroke-width="9"
					stroke-dasharray="{transportDash} {circ}" stroke-dashoffset="-{foodDash}"
					stroke-linecap="round" transform="rotate(-90 50 50)"
					style="transition: all 0.4s ease"/>
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(80,200,120,0.65)" stroke-width="9"
					stroke-dasharray="{savingsDash} {circ}" stroke-dashoffset="-{foodDash + transportDash}"
					stroke-linecap="round" transform="rotate(-90 50 50)"
					style="transition: all 0.4s ease"/>
				<text x="50" y="47" font-family="DM Sans,sans-serif" font-size="11" fill="rgba(255,255,255,0.85)" text-anchor="middle" font-weight="500">
					{activeIdx !== null ? `${steps[activeIdx]}%` : ''}
				</text>
				<text x="50" y="59" font-family="DM Sans,sans-serif" font-size="8" fill="rgba(255,255,255,0.28)" text-anchor="middle" font-weight="300">{m.onboarding_savings_pill()}</text>
			</svg>
			<div class="cat-pills">
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(74,127,255,0.8)"></div>{m.category_food()}</div>
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(123,79,255,0.8)"></div>{m.category_transport()}</div>
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(80,200,120,0.8)"></div>{m.onboarding_savings_pill()}</div>
			</div>
		</div>
	</div>

	<div class="text-block">
		<div class="slide-num">04 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_savings_title()}</h2>
	</div>

	<div class="savings-area">
		<div class="slider-wrap">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="track"
				bind:this={trackEl}
				ontouchstart={onTrackTouch}
				ontouchmove={onTrackTouch}
				onclick={onTrackClick}
			>
				<div class="track-fill" style="width:{((activeIdx ?? 0) / (steps.length - 1)) * 100}%"></div>
				{#each steps as pct, i (pct)}
					<div
						class="stop"
						class:reached={activeIdx !== null && i <= activeIdx}
						class:active={activeIdx === i}
						style="left:{(i / (steps.length - 1)) * 100}%"
					>
						<div class="stop-dot"></div>
						<span class="stop-label">{pct}%</span>
					</div>
				{/each}
				<div class="track-touch-area"></div>
			</div>
		</div>

		<div class="summary">
			<div class="summary-row">
				<span class="summary-label">{m.onboarding_savings_pill()}</span>
				<span class="summary-val green">{cur}{fmt(toDisplay(savingsAmount))} <span class="dim">{m.onboarding_per_month()}</span></span>
			</div>
			<div class="summary-row">
				<span class="summary-label">{m.onboarding_remaining_for_expenses()}</span>
				<span class="summary-val">{cur}{fmt(toDisplay(budget))} <span class="dim">≈ {cur}{fmt(dailyBudget)}/{m.home_days_short()}</span></span>
			</div>
		</div>
	</div>

	<div class="bottom">
		<Button variant="primary" size="lg" class="text-[15px] rounded-[18px]" onclick={onNext}>{m.onboarding_next()} →</Button>
	</div>
</div>

<style>
	.slide { display: flex; flex-direction: column; height: 100%; justify-content: center; }

	.visual {
		position: relative; height: 200px; overflow: hidden; flex-shrink: 0;
		display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
	}

	.glow {
		position: absolute; border-radius: 50%; pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.glow-1 {
		width: 220px; height: 200px; left: 50%; top: -30px; transform: translateX(-50%);
		background: radial-gradient(ellipse, rgba(80,200,120,0.16) 0%, transparent 70%);
	}
	.glow-2 {
		width: 160px; height: 140px; right: 0; bottom: 0;
		background: radial-gradient(ellipse, rgba(60,100,255,0.14) 0%, transparent 70%);
		animation-delay: 2s;
	}

	.ill {
		position: relative; z-index: 2;
		display: flex; flex-direction: column; align-items: center; gap: 12px;
	}

	.cat-pills {
		display: flex; flex-wrap: wrap; gap: 6px; justify-content: center;
	}
	.cat-pill {
		display: flex; align-items: center; gap: 5px;
		background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.09);
		border-radius: 16px; padding: 5px 10px;
		font-size: 11px; color: rgba(255,255,255,0.55); font-weight: 400;
	}
	.pill-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

	.text-block { padding: 8px 24px 0; display: flex; flex-direction: column; }
	.slide-num {
		font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
		color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 8px;
	}
	.slide-title {
		font-size: 32px; font-weight: 500; color: #fff; letter-spacing: -0.8px;
		line-height: 1.15;
	}
	.slide-title :global(em) {
		font-style: normal; color: rgba(255,255,255,0.38); font-weight: 300;
	}

	.savings-area {
		padding: 20px 24px 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.slider-wrap {
		padding: 10px 0 20px;
		user-select: none;
		-webkit-user-select: none;
	}

	.track {
		position: relative;
		height: 4px;
		background: rgba(255,255,255,0.08);
		border-radius: 99px;
		margin: 0 8px;
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

	.track-touch-area {
		position: absolute;
		top: -20px;
		bottom: -20px;
		left: 0;
		right: 0;
		cursor: pointer;
	}

	.stop-label {
		position: absolute;
		top: 24px;
		font-size: 11px;
		color: rgba(255,255,255,0.2);
		font-weight: 300;
		white-space: nowrap;
		transition: color 0.2s ease;
	}

	.stop.active .stop-label {
		color: rgba(80,200,120,0.85);
		font-weight: 500;
	}

	.summary {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 14px;
		background: rgba(255,255,255,0.03);
		border: 1px solid rgba(255,255,255,0.06);
		border-radius: 16px;
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
	.dim {
		font-size: 11px;
		color: rgba(255,255,255,0.25);
		font-weight: 300;
	}

	.bottom { padding: 16px 24px 28px; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
</style>
