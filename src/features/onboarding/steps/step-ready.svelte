<script lang="ts">
	import { scale } from 'svelte/transition';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		budget,
		onFinish,
		onBack
	}: { budget: number; onFinish: () => void; onBack: () => void } = $props();

	const daysLeft = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() - new Date().getDate() + 1;
	const budgetLabel = $derived(budget >= 1000 ? `₴${(budget / 1000).toFixed(0)}k` : `₴${fmt(budget)}`);
</script>

<div class="slide">
	<div class="visual">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>

		<div class="ready-content">
			<div class="checkmark-circle" in:scale={{ duration: 500, start: 0, delay: 100 }}>
				<svg width="36" height="36" viewBox="0 0 36 36" fill="none">
					<circle cx="18" cy="18" r="17" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
					<path d="M11 18.5L15.5 23L25 13" stroke="rgba(255,255,255,0.85)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
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

	<div class="text-block">
		<div class="slide-num">05 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_slide4_title()}</h2>
		<p class="slide-desc">{m.onboarding_slide4_desc()}</p>
	</div>

	<div class="bottom">
		<button class="btn-final" onclick={onFinish}>{m.onboarding_open_app()}</button>
		<button class="btn-secondary" onclick={onBack}>← {m.onboarding_back()}</button>
	</div>
</div>

<style>
	.slide { display: flex; flex-direction: column; height: 100%; justify-content: center; }

	.visual {
		position: relative; height: 280px; overflow: hidden; flex-shrink: 0;
		display: flex; flex-direction: column; align-items: center; justify-content: center;
	}

	.glow {
		position: absolute; border-radius: 50%; pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.glow-1 {
		width: 280px; height: 280px; left: 50%; top: 50%; transform: translate(-50%,-50%);
		background: radial-gradient(ellipse, rgba(60,100,255,0.2) 0%, transparent 60%);
	}
	.glow-2 {
		width: 200px; height: 200px; left: 50%; top: 50%; transform: translate(-50%,-50%);
		background: radial-gradient(ellipse, rgba(120,60,220,0.18) 0%, transparent 60%);
		animation-delay: 2s;
	}

	.ready-content {
		position: relative; z-index: 2;
		display: flex; flex-direction: column; align-items: center; gap: 14px;
	}

	.checkmark-circle {
		width: 70px; height: 70px; border-radius: 50%;
		background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
		display: flex; align-items: center; justify-content: center;
	}

	.mini-cards { display: flex; gap: 8px; }
	.mini-card {
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 14px; padding: 8px 12px; text-align: center; flex: 1;
		min-width: 65px;
	}
	.mini-card-val {
		font-size: 15px; font-weight: 500; color: #fff; letter-spacing: -0.3px;
	}
	.mini-card-val.green { color: rgba(80,200,120,0.85); }
	.mini-card-label {
		font-size: 9px; color: rgba(255,255,255,0.25); font-weight: 300; margin-top: 2px;
	}

	.mini-bars {
		display: flex; align-items: flex-end; gap: 4px; height: 48px;
	}
	.mini-bar {
		width: 16px; border-radius: 3px 3px 0 0;
		background: rgba(80,130,255,0.7);
	}
	.mini-bar.active {
		background: rgba(80,200,120,0.7);
	}

	.text-block { padding: 8px 28px 0; display: flex; flex-direction: column; }
	.slide-num {
		font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
		color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 10px;
	}
	.slide-title {
		font-size: 32px; font-weight: 500; color: #fff; letter-spacing: -0.8px;
		line-height: 1.15; margin-bottom: 10px;
	}
	.slide-title :global(em) {
		font-style: normal; color: rgba(255,255,255,0.38); font-weight: 300;
	}
	.slide-desc {
		font-size: 15px; color: rgba(255,255,255,0.38); font-weight: 300; line-height: 1.6;
	}

	.bottom { padding: 20px 24px 28px; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }

	.btn-final {
		width: 100%; padding: 16px; border-radius: 18px; border: none; cursor: pointer;
		font-family: var(--font); font-size: 15px; font-weight: 500;
		background: linear-gradient(135deg, rgba(60,100,255,0.8), rgba(120,60,220,0.8));
		color: #fff;
		box-shadow: 0 8px 24px rgba(60,100,255,0.25);
	}

	.btn-secondary {
		width: 100%; padding: 14px; border-radius: 18px; cursor: pointer;
		font-family: var(--font); font-size: 14px; font-weight: 400;
		background: transparent; border: 1px solid rgba(255,255,255,0.1);
		color: rgba(255,255,255,0.45);
	}
	.btn-secondary:hover { border-color: rgba(255,255,255,0.2); }
</style>
