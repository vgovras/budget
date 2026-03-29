<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onNext }: { onNext: () => void } = $props();

	let locale = $state(getLocale());

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as (typeof locales)[number]);
		}
	});
</script>

<div class="slide-layout">
	<div class="slide-visual h-72">
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>
		<div class="ill">
			<svg width="260" height="260" viewBox="0 0 200 200" fill="none">
				<rect x="30" y="60" width="140" height="88" rx="16" fill="var(--surface-4)" stroke="var(--surface-8)" stroke-width="1"/>
				<rect x="18" y="48" width="140" height="88" rx="16" fill="var(--card)" stroke="var(--accent-border)" stroke-width="1"/>
				<ellipse cx="50" cy="62" rx="40" ry="25" fill="var(--accent-bg)"/>
				<rect x="34" y="68" width="28" height="20" rx="4" fill="var(--surface-10)" stroke="var(--surface-16)" stroke-width="0.8"/>
				<line x1="34" y1="76" x2="62" y2="76" stroke="var(--surface-12)" stroke-width="0.8"/>
				<line x1="34" y1="80" x2="62" y2="80" stroke="var(--surface-8)" stroke-width="0.8"/>
				<text x="34" y="108" font-family="DM Sans,sans-serif" font-size="11" fill="var(--text-mid)" font-weight="400">{m.account_balance()}</text>
				<text x="34" y="124" font-family="DM Sans,sans-serif" font-size="20" fill="var(--text-hi)" font-weight="500" letter-spacing="-0.5">₴31 856</text>
				<circle cx="118" cy="120" r="7" fill="rgba(255,100,100,0.5)"/>
				<circle cx="130" cy="120" r="7" fill="rgba(255,160,60,0.7)"/>
				<rect x="18" y="130" width="140" height="3" rx="0" fill="var(--surface-4)"/>
				<rect x="18" y="130" width="3" height="3" rx="0" fill="var(--accent)"/>
				<rect x="110" y="42" width="66" height="28" rx="10" fill="var(--card)" stroke="var(--success-border)" stroke-width="1"/>
				<circle cx="124" cy="56" r="5" fill="rgba(80,200,120,0.2)"/>
				<circle cx="124" cy="56" r="2.5" fill="rgba(80,200,120,0.8)"/>
				<text x="133" y="53" font-family="DM Sans,sans-serif" font-size="8" fill="var(--text-secondary)" font-weight="400">{m.account_budget_label()}</text>
				<text x="133" y="63" font-family="DM Sans,sans-serif" font-size="10" fill="var(--success)" font-weight="500">+₴2 000</text>
			</svg>
		</div>
	</div>

	<div class="slide-text-block">
		<div class="slide-num">01 / 05</div>
		<h2 class="slide-title">{@html m.onboarding_slide1_title()}</h2>
		<p class="slide-desc">{m.onboarding_slide1_desc()}</p>
	</div>

	<div class="flex-1 flex items-center justify-center">
		<div class="flex items-center gap-3">
			<Dropdown bind:value={locale} options={LANG_OPTIONS} position="top" />
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="w-[48px] self-stretch rounded-sm flex items-center justify-center shrink-0 bg-surface-5 border border-surface-8 text-text-mid cursor-pointer transition-all duration-200 active:scale-95"
				onclick={() => settingsVM.toggleTheme()}
			>
				<Icon name={settingsVM.theme === 'dark' ? 'sun' : 'moon'} size={16} />
			</div>
		</div>
	</div>

	<div class="slide-bottom">
		<Button variant="primary" size="lg" class="text-base rounded-[18px]" onclick={onNext}>{m.onboarding_start()} →</Button>
	</div>
</div>

<style>
	.glow-1 {
		width: 260px; height: 200px; left: -40px; top: -40px;
		background: radial-gradient(ellipse, rgba(60, 100, 255, 0.35) 0%, transparent 70%);
	}
	.glow-2 {
		width: 180px; height: 180px; right: -20px; bottom: -20px;
		background: radial-gradient(ellipse, rgba(120, 60, 220, 0.25) 0%, transparent 70%);
		animation-delay: 2s;
	}
	.ill {
		position: relative; z-index: 2;
		animation: float 3.5s ease-in-out infinite;
	}
	@keyframes float {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}
</style>
