<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onNext }: { onNext: () => void } = $props();

	let locale = $state(getLocale());

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as (typeof locales)[number]);
		}
	});
</script>

<div class="flex flex-col h-full justify-center">
	<div class="relative h-60 overflow-hidden shrink-0 flex items-center justify-center">
		<div class="glow glow-1"></div>
		<div class="glow glow-2"></div>
		<div class="ill">
			<svg width="200" height="200" viewBox="0 0 200 200" fill="none">
				<rect x="30" y="60" width="140" height="88" rx="16" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
				<rect x="18" y="48" width="140" height="88" rx="16" fill="rgba(30,30,60,0.9)" stroke="rgba(80,120,255,0.25)" stroke-width="1"/>
				<ellipse cx="50" cy="62" rx="40" ry="25" fill="rgba(60,100,255,0.18)"/>
				<rect x="34" y="68" width="28" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" stroke-width="0.8"/>
				<line x1="34" y1="76" x2="62" y2="76" stroke="rgba(255,255,255,0.12)" stroke-width="0.8"/>
				<line x1="34" y1="80" x2="62" y2="80" stroke="rgba(255,255,255,0.08)" stroke-width="0.8"/>
				<text x="34" y="108" font-family="DM Sans,sans-serif" font-size="11" fill="rgba(255,255,255,0.35)" font-weight="300">{m.account_balance()}</text>
				<text x="34" y="124" font-family="DM Sans,sans-serif" font-size="20" fill="rgba(255,255,255,0.9)" font-weight="500" letter-spacing="-0.5">₴31 856</text>
				<circle cx="118" cy="120" r="7" fill="rgba(255,100,100,0.5)"/>
				<circle cx="130" cy="120" r="7" fill="rgba(255,160,60,0.7)"/>
				<rect x="18" y="130" width="140" height="3" rx="0" fill="rgba(255,255,255,0.04)"/>
				<rect x="18" y="130" width="3" height="3" rx="0" fill="rgba(80,130,255,0.8)"/>
				<rect x="110" y="42" width="66" height="28" rx="10" fill="rgba(15,15,30,0.95)" stroke="rgba(80,200,120,0.25)" stroke-width="1"/>
				<circle cx="124" cy="56" r="5" fill="rgba(80,200,120,0.2)"/>
				<circle cx="124" cy="56" r="2.5" fill="rgba(80,200,120,0.8)"/>
				<text x="133" y="53" font-family="DM Sans,sans-serif" font-size="8" fill="rgba(255,255,255,0.5)" font-weight="300">{m.account_budget_label()}</text>
				<text x="133" y="63" font-family="DM Sans,sans-serif" font-size="10" fill="rgba(80,200,120,0.9)" font-weight="500">+₴2 000</text>
			</svg>
		</div>
	</div>

	<div class="px-7 pt-2 flex flex-col">
		<div class="text-2xs tracking-[1.5px] uppercase text-text-muted font-medium mb-2.5">01 / 05</div>
		<h2 class="text-[32px] font-medium text-white tracking-tight leading-[1.15] mb-2.5">{@html m.onboarding_slide1_title()}</h2>
		<p class="text-base text-text-mid font-light leading-relaxed">{m.onboarding_slide1_desc()}</p>
	</div>

	<div class="px-6 pt-4 pb-7 flex flex-col gap-2.5 mt-auto">
		<Button variant="primary" size="lg" class="text-base rounded-[18px]" onclick={onNext}>{m.onboarding_start()} →</Button>
		<div class="flex justify-center">
			<Dropdown bind:value={locale} options={LANG_OPTIONS} position="top" />
		</div>
	</div>
</div>

<style>
	.glow {
		position: absolute;
		border-radius: 50%;
		pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.glow-1 {
		width: 260px;
		height: 200px;
		left: -40px;
		top: -40px;
		background: radial-gradient(ellipse, rgba(60, 100, 255, 0.22) 0%, transparent 70%);
	}
	.glow-2 {
		width: 180px;
		height: 180px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(ellipse, rgba(120, 60, 220, 0.16) 0%, transparent 70%);
		animation-delay: 2s;
	}
	.ill {
		position: relative;
		z-index: 2;
		animation: float 3.5s ease-in-out infinite;
	}
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
	h2 :global(em) {
		font-style: normal;
		color: rgba(255, 255, 255, 0.38);
		font-weight: 300;
	}
</style>
