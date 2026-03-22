<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import SavingsEditor from '$lib/ui/savings-editor/savings-editor.svelte';
	import { convert } from '$lib/utils/currency.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		salary,
		currency = '₴',
		fiatViewEnabled = false,
		fiatCurrency = '₴',
		savingsPercent,
		savingsAmount,
		budget,
		onSetPercent,
		onNext
	}: {
		salary: number;
		currency?: string;
		fiatViewEnabled?: boolean;
		fiatCurrency?: string;
		savingsPercent: number;
		savingsAmount: number;
		budget: number;
		onSetPercent: (pct: number) => void;
		onNext: () => void;
	} = $props();

	const isFiat = $derived(fiatViewEnabled && fiatCurrency !== currency);
	const cur = $derived(isFiat ? fiatCurrency : currency);

	function toDisplay(amount: number): number {
		return isFiat ? convert(amount, currency, fiatCurrency) : amount;
	}

	// Donut proportions
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
					{savingsPercent}%
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
		<SavingsEditor
			{savingsPercent}
			savingsAmount={toDisplay(savingsAmount)}
			budget={toDisplay(budget)}
			currency={cur}
			{onSetPercent}
		/>
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
	}

	.bottom { padding: 16px 24px 28px; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
</style>
