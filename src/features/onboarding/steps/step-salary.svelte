<script lang="ts">
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		value = $bindable<number | null>(null),
		onNext,
		onSkip
	}: { value: number | null; onNext: () => void; onSkip: () => void } = $props();

	const canNext = $derived(value !== null && value > 0);
	const displayAmount = $derived(value && value > 0 ? `₴${fmt(value)}` : '₴0');
</script>

<div class="slide">
	<div class="visual">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="ill">
			<svg width="160" height="160" viewBox="0 0 200 200" fill="none">
				<rect x="30" y="60" width="140" height="88" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
				<rect x="18" y="48" width="140" height="88" rx="16" fill="rgba(30,30,60,0.9)" stroke="rgba(80,120,255,0.25)" stroke-width="1"/>
				<ellipse cx="50" cy="62" rx="40" ry="25" fill="rgba(60,100,255,0.18)"/>
				<rect x="34" y="68" width="28" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
				<line x1="34" y1="76" x2="62" y2="76" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
				<text x="34" y="108" font-family="DM Sans,sans-serif" font-size="11" fill="rgba(255,255,255,0.35)" font-weight="300">Дохід</text>
				<text x="34" y="124" font-family="DM Sans,sans-serif" font-size="18" fill="rgba(255,255,255,0.9)" font-weight="500" letter-spacing="-0.5">{displayAmount}</text>
				<circle cx="118" cy="120" r="7" fill="rgba(80,200,120,0.5)"/>
				<circle cx="130" cy="120" r="7" fill="rgba(80,200,120,0.3)"/>
			</svg>
		</div>
	</div>

	<div class="text-block">
		<div class="slide-num">02 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_salary_title()}</h2>
		<p class="slide-desc">{m.onboarding_salary_desc()}</p>
	</div>

	<div class="input-area">
		<MoneyInput bind:value size="lg" placeholder="30 000" autofocus />
	</div>

	<div class="bottom">
		<button class="btn-primary" disabled={!canNext} onclick={onNext}>{m.onboarding_next()} →</button>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="skip-link" onclick={onSkip}>{m.onboarding_skip()}</div>
	</div>
</div>

<style>
	.slide { display: flex; flex-direction: column; height: 100%; justify-content: center; }

	.visual {
		position: relative; height: 180px; overflow: hidden; flex-shrink: 0;
		display: flex; align-items: center; justify-content: center;
	}

	.glow {
		position: absolute; border-radius: 50%; pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.glow-1 {
		width: 240px; height: 180px; left: -30px; top: -30px;
		background: radial-gradient(ellipse, rgba(80,200,120,0.18) 0%, transparent 70%);
	}
	.glow-2 {
		width: 160px; height: 160px; right: -20px; bottom: -20px;
		background: radial-gradient(ellipse, rgba(60,100,255,0.14) 0%, transparent 70%);
		animation-delay: 2s;
	}

	.ill { position: relative; z-index: 2; }

	.text-block { padding: 8px 28px 0; display: flex; flex-direction: column; }
	.slide-num {
		font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
		color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 10px;
	}
	.slide-title {
		font-size: 28px; font-weight: 500; color: #fff; letter-spacing: -0.8px;
		line-height: 1.15; margin-bottom: 10px;
	}
	.slide-title :global(em) {
		font-style: normal; color: rgba(255,255,255,0.38); font-weight: 300;
	}
	.slide-desc {
		font-size: 14px; color: rgba(255,255,255,0.38); font-weight: 300; line-height: 1.6;
	}

	.input-area {
		padding: 20px 28px 0;
	}

	.bottom { padding: 16px 24px 28px; display: flex; flex-direction: column; gap: 10px; margin-top: auto; }
	.btn-primary {
		width: 100%; padding: 16px; border-radius: 18px; border: none; cursor: pointer;
		font-family: var(--font); font-size: 15px; font-weight: 500;
		background: rgba(255,255,255,0.95); color: #08080f;
		transition: opacity 0.2s;
	}
	.btn-primary:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.skip-link {
		text-align: center; font-size: 12px; color: rgba(255,255,255,0.2);
		cursor: pointer; padding-top: 4px; font-weight: 300;
	}
	.skip-link:hover { color: rgba(255,255,255,0.4); }
</style>
