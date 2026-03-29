<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import { scale } from 'svelte/transition';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		budget,
		currency = '₴',
		onFinish,
		onBack
	}: { budget: number; currency?: string; onFinish: () => void; onBack: () => void } = $props();

	const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
	const budgetLabel = $derived(budget >= 1000 ? `${currency}${(budget / 1000).toFixed(0)}k` : `${currency}${fmt(budget)}`);
</script>

<div class="slide-layout">
	<div class="slide-visual" style="height:280px;flex-direction:column">
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>

		<div class="ready-content">
			<div class="checkmark-circle" in:scale={{ duration: 500, start: 0, delay: 100 }}>
				<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
					<circle cx="18" cy="18" r="17" stroke="var(--surface-10)" stroke-width="1"/>
					<path d="M11 18.5L15.5 23L25 13" stroke="var(--text-hi)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>

			<div class="mini-cards">
				<div class="mini-card">
					<div class="mini-card-val">{budgetLabel}</div>
					<div class="mini-card-label">{m.account_budget_label()}</div>
				</div>
				<div class="mini-card">
					<div class="mini-card-val">{daysLeft}</div>
					<div class="mini-card-label">{m.onboarding_days()}</div>
				</div>
				<div class="mini-card">
					<div class="mini-card-val green">0%</div>
					<div class="mini-card-label">{m.onboarding_spent()}</div>
				</div>
			</div>

			<!-- Mini bar chart -->
			<div class="mini-bars">
				<div class="mini-bar" style="height:20px;opacity:0.25"></div>
				<div class="mini-bar" style="height:32px;opacity:0.35"></div>
				<div class="mini-bar" style="height:24px;opacity:0.3"></div>
				<div class="mini-bar" style="height:40px;opacity:0.5"></div>
				<div class="mini-bar" style="height:28px;opacity:0.35"></div>
				<div class="mini-bar" style="height:48px;opacity:0.6"></div>
				<div class="mini-bar active" style="height:8px;opacity:0.8"></div>
			</div>
		</div>
	</div>

	<div class="slide-text-block">
		<div class="slide-num">05 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_slide4_title()}</h2>
		<p class="slide-desc">{m.onboarding_slide4_desc()}</p>
	</div>

	<div class="slide-bottom">
		<Button variant="gradient" size="lg" class="text-md rounded-[18px]" onclick={onFinish}>{m.onboarding_open_app()}</Button>
		<Button variant="outline" size="lg" class="text-sm font-normal rounded-[18px]" onclick={onBack}>← {m.onboarding_back()}</Button>
	</div>
</div>

<style>
	.glow-1 {
		width: 280px; height: 280px; left: 50%; top: 50%; transform: translate(-50%,-50%);
		background: radial-gradient(ellipse, rgba(60,100,255,0.3) 0%, transparent 60%);
	}
	.glow-2 {
		width: 200px; height: 200px; left: 50%; top: 50%; transform: translate(-50%,-50%);
		background: radial-gradient(ellipse, rgba(120,60,220,0.3) 0%, transparent 60%);
		animation-delay: 2s;
	}
	.ready-content {
		position: relative; z-index: 2;
		display: flex; flex-direction: column; align-items: center; gap: 0.875rem;
	}
	.checkmark-circle {
		width: 4.375rem; height: 4.375rem; border-radius: 50%;
		background: var(--surface-5); border: 1px solid var(--border-hi);
		display: flex; align-items: center; justify-content: center;
	}
	.mini-cards { display: flex; gap: 0.5rem; }
	.mini-card {
		background: var(--surface-5); border: 1px solid var(--surface-8);
		border-radius: 0.875rem; padding: 0.5rem 0.75rem; text-align: center; flex: 1;
		min-width: 4.0625rem;
	}
	.mini-card-val {
		font-size: 0.9375rem; font-weight: 500; color: var(--text-hi); letter-spacing: -0.3px;
	}
	.mini-card-val.green { color: var(--success); }
	.mini-card-label {
		font-size: 0.625rem; color: var(--text-lo); font-weight: 400; margin-top: 0.125rem;
	}
	.mini-bars {
		display: flex; align-items: flex-end; gap: 0.25rem; height: 3rem;
	}
	.mini-bar {
		width: 1rem; border-radius: 3px 3px 0 0;
		background: var(--accent);
	}
	.mini-bar.active { background: var(--success); }
</style>
