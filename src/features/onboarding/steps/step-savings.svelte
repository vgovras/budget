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

<div class="slide-layout">
	<div class="slide-visual" style="height:200px;flex-direction:column;gap:0.75rem">
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>
		<div class="ill">
			<svg width="100" height="100" viewBox="0 0 100 100">
				<circle cx="50" cy="50" r="38" fill="none" stroke="var(--surface-4)" stroke-width="9"/>
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
				<text x="50" y="47" font-family="DM Sans,sans-serif" font-size="11" fill="var(--text-hi)" text-anchor="middle" font-weight="500">
					{savingsPercent}%
				</text>
				<text x="50" y="59" font-family="DM Sans,sans-serif" font-size="8" fill="var(--text-mid)" text-anchor="middle" font-weight="400">{m.onboarding_savings_pill()}</text>
			</svg>
			<div class="cat-pills">
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(74,127,255,0.8)"></div>{m.category_food()}</div>
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(123,79,255,0.8)"></div>{m.category_transport()}</div>
				<div class="cat-pill"><div class="pill-dot" style="background:rgba(80,200,120,0.8)"></div>{m.onboarding_savings_pill()}</div>
			</div>
		</div>
	</div>

	<div class="slide-text-block">
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

	<div class="slide-bottom">
		<Button variant="primary" size="lg" class="text-md rounded-[18px]" onclick={onNext}>{m.onboarding_next()} →</Button>
	</div>
</div>

<style>
	.glow-1 {
		width: 220px; height: 200px; left: 50%; top: -30px; transform: translateX(-50%);
		background: radial-gradient(ellipse, rgba(80,200,120,0.3) 0%, transparent 70%);
	}
	.glow-2 {
		width: 160px; height: 140px; right: 0; bottom: 0;
		background: radial-gradient(ellipse, rgba(60,100,255,0.25) 0%, transparent 70%);
		animation-delay: 2s;
	}
	.ill {
		position: relative; z-index: 2;
		display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
	}
	.cat-pills {
		display: flex; flex-wrap: wrap; gap: 0.375rem; justify-content: center;
	}
	.cat-pill {
		display: flex; align-items: center; gap: 0.3125rem;
		background: var(--surface-5); border: 1px solid var(--surface-8);
		border-radius: 1rem; padding: 0.3125rem 0.625rem;
		font-size: 0.6875rem; color: var(--text-secondary); font-weight: 400;
	}
	.pill-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
	.savings-area { padding: 1.25rem 1.5rem 0; }
</style>
