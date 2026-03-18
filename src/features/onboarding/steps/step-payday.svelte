<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let {
		value = $bindable(1),
		onNext,
		onSkip
	}: { value: number; onNext: () => void; onSkip: () => void } = $props();

	const days = Array.from({ length: 31 }, (_, i) => i + 1);
</script>

<div class="slide">
	<div class="visual">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="ill">
			<svg width="100" height="100" viewBox="0 0 100 100" fill="none">
				<rect x="15" y="10" width="70" height="70" rx="14" fill="rgba(30,30,60,0.9)" stroke="rgba(80,120,255,0.25)" stroke-width="1"/>
				<rect x="15" y="10" width="70" height="20" rx="14" fill="rgba(60,100,255,0.15)"/>
				<rect x="15" y="24" width="70" height="6" fill="rgba(60,100,255,0.15)"/>
				<line x1="30" y1="6" x2="30" y2="16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
				<line x1="70" y1="6" x2="70" y2="16" stroke="rgba(255,255,255,0.2)" stroke-width="2" stroke-linecap="round"/>
				<circle cx="50" cy="55" r="12" fill="rgba(80,130,255,0.2)" stroke="rgba(80,130,255,0.4)" stroke-width="1"/>
				<text x="50" y="59" font-family="DM Sans,sans-serif" font-size="12" fill="rgba(255,255,255,0.85)" text-anchor="middle" font-weight="500">{value}</text>
			</svg>
		</div>
	</div>

	<div class="text-block">
		<div class="slide-num">03 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_payday_title()}</h2>
		<p class="slide-desc">{m.onboarding_payday_desc()}</p>
	</div>

	<div class="day-grid">
		{#each days as day (day)}
			<button
				class="day-btn"
				class:active={value === day}
				onclick={() => (value = day)}
			>{day}</button>
		{/each}
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
		position: relative; height: 140px; overflow: hidden; flex-shrink: 0;
		display: flex; align-items: center; justify-content: center;
	}

	.glow {
		position: absolute; border-radius: 50%; pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.glow-1 {
		width: 200px; height: 160px; left: -20px; top: -30px;
		background: radial-gradient(ellipse, rgba(60,100,255,0.2) 0%, transparent 70%);
	}
	.glow-2 {
		width: 140px; height: 140px; right: -10px; bottom: -20px;
		background: radial-gradient(ellipse, rgba(120,60,220,0.15) 0%, transparent 70%);
		animation-delay: 2s;
	}

	.ill { position: relative; z-index: 2; }

	.text-block { padding: 4px 28px 0; display: flex; flex-direction: column; }
	.slide-num {
		font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
		color: rgba(255,255,255,0.2); font-weight: 500; margin-bottom: 8px;
	}
	.slide-title {
		font-size: 32px; font-weight: 500; color: #fff; letter-spacing: -0.8px;
		line-height: 1.15; margin-bottom: 6px;
	}
	.slide-title :global(em) {
		font-style: normal; color: rgba(255,255,255,0.38); font-weight: 300;
	}
	.slide-desc {
		font-size: 15px; color: rgba(255,255,255,0.38); font-weight: 300; line-height: 1.6;
	}

	.day-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 6px;
		padding: 12px 24px 0;
	}
	.day-btn {
		aspect-ratio: 1;
		border-radius: 10px;
		border: 1px solid rgba(255,255,255,0.07);
		background: rgba(255,255,255,0.04);
		color: rgba(255,255,255,0.5);
		font-family: var(--font);
		font-size: 13px;
		font-weight: 400;
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.day-btn:active {
		background: rgba(255,255,255,0.08);
	}
	.day-btn.active {
		background: rgba(80,130,255,0.15);
		border-color: rgba(80,130,255,0.35);
		color: #fff;
		font-weight: 500;
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
