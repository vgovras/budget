<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		salary,
		steps,
		activeIdx,
		savingsAmount,
		budget,
		onSelectIdx,
		onNext,
		onSkip
	}: {
		salary: number;
		steps: number[];
		activeIdx: number | null;
		savingsAmount: number;
		budget: number;
		onSelectIdx: (idx: number) => void;
		onNext: () => void;
		onSkip: () => void;
	} = $props();

	const dailyBudget = $derived(Math.floor(budget / 30));

	// Donut proportions for savings visual
	const savingsPct = $derived(salary > 0 ? savingsAmount / salary : 0);
	const circ = 2 * Math.PI * 38;
	const savingsDash = $derived(savingsPct * circ);
	const expensesDash = $derived((1 - savingsPct) * circ);
</script>

<div class="slide">
	<div class="visual">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="ill">
			<svg width="100" height="100" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="9"/>
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(74,127,255,0.75)" stroke-width="9"
					stroke-dasharray="{expensesDash} {circ}" stroke-dashoffset="0"
					stroke-linecap="round" transform="rotate(-90 50 50)"
					style="transition: stroke-dasharray 0.4s ease"/>
				<circle cx="50" cy="50" r="38" fill="none" stroke="rgba(80,200,120,0.65)" stroke-width="9"
					stroke-dasharray="{savingsDash} {circ}" stroke-dashoffset="-{expensesDash}"
					stroke-linecap="round" transform="rotate(-90 50 50)"
					style="transition: all 0.4s ease"/>
				<text x="50" y="47" font-family="DM Sans,sans-serif" font-size="11" fill="rgba(255,255,255,0.85)" text-anchor="middle" font-weight="500">
					{activeIdx !== null ? `${steps[activeIdx]}%` : ''}
				</text>
				<text x="50" y="59" font-family="DM Sans,sans-serif" font-size="8" fill="rgba(255,255,255,0.28)" text-anchor="middle" font-weight="300">заощадження</text>
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
		<div class="slider-row">
			{#each steps as pct, i (pct)}
				<button
					class="slider-stop"
					class:active={activeIdx === i}
					onclick={() => onSelectIdx(i)}
				>{pct}%</button>
			{/each}
		</div>

		<div class="summary">
			<div class="summary-row">
				<span class="summary-label">{m.onboarding_savings_pill()}</span>
				<span class="summary-val green">₴{fmt(savingsAmount)} <span class="dim">{m.onboarding_per_month()}</span></span>
			</div>
			<div class="summary-row">
				<span class="summary-label">{m.onboarding_remaining_for_expenses()}</span>
				<span class="summary-val">₴{fmt(budget)} <span class="dim">≈ ₴{fmt(dailyBudget)}/{m.home_days_short()}</span></span>
			</div>
		</div>
	</div>

	<div class="bottom">
		<button class="btn-primary" onclick={onNext}>{m.onboarding_next()} →</button>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="skip-link" onclick={onSkip}>{m.onboarding_skip()}</div>
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

	.text-block { padding: 4px 28px 0; display: flex; flex-direction: column; }
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
		padding: 16px 24px 0;
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.slider-row {
		display: flex;
		gap: 6px;
	}
	.slider-stop {
		flex: 1;
		padding: 10px 4px;
		border-radius: 12px;
		border: 1px solid rgba(255,255,255,0.07);
		background: rgba(255,255,255,0.04);
		color: rgba(255,255,255,0.4);
		font-family: var(--font);
		font-size: 13px;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.15s ease;
		text-align: center;
	}
	.slider-stop.active {
		background: rgba(80,200,120,0.12);
		border-color: rgba(80,200,120,0.3);
		color: rgba(80,200,120,0.9);
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

	.bottom { padding: 12px 24px 28px; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
	.btn-primary {
		width: 100%; padding: 16px; border-radius: 18px; border: none; cursor: pointer;
		font-family: var(--font); font-size: 15px; font-weight: 500;
		background: rgba(255,255,255,0.95); color: #08080f;
	}
	.skip-link {
		text-align: center; font-size: 12px; color: rgba(255,255,255,0.2);
		cursor: pointer; padding-top: 4px; font-weight: 300;
	}
	.skip-link:hover { color: rgba(255,255,255,0.4); }
</style>
