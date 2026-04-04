<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { authClient } from '$lib/auth-client';
	import * as m from '$lib/paraglide/messages.js';

	let { onNext }: { onNext: () => void } = $props();

	let locale = $state(getLocale());

	const session = authClient.useSession();
	const isLoggedIn = $derived(!!$session.data);

	async function toggleGoogle() {
		await authClient.signIn.social({ provider: 'google' });
	}

	$effect(() => {
		const run = async () => {
			const isSessionAlive = await authClient.revokeSessions();
			console.log('Session alive:', isSessionAlive);

			if (isLoggedIn) {
				console.log('User just logged in!');
				onNext();
			}
		};

		run();
	});

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
				<rect
					x="30"
					y="60"
					width="140"
					height="88"
					rx="16"
					fill="var(--surface-4)"
					stroke="var(--surface-8)"
					stroke-width="1"
				/>
				<rect
					x="18"
					y="48"
					width="140"
					height="88"
					rx="16"
					fill="var(--card)"
					stroke="var(--accent-border)"
					stroke-width="1"
				/>
				<ellipse cx="50" cy="62" rx="40" ry="25" fill="var(--accent-bg)" />
				<rect
					x="34"
					y="68"
					width="28"
					height="20"
					rx="4"
					fill="var(--surface-10)"
					stroke="var(--surface-16)"
					stroke-width="0.8"
				/>
				<line x1="34" y1="76" x2="62" y2="76" stroke="var(--surface-12)" stroke-width="0.8" />
				<line x1="34" y1="80" x2="62" y2="80" stroke="var(--surface-8)" stroke-width="0.8" />
				<text
					x="34"
					y="108"
					font-family="DM Sans,sans-serif"
					font-size="11"
					fill="var(--text-mid)"
					font-weight="400">{m.account_balance()}</text
				>
				<text
					x="34"
					y="124"
					font-family="DM Sans,sans-serif"
					font-size="20"
					fill="var(--text-hi)"
					font-weight="500"
					letter-spacing="-0.5">₴31 856</text
				>
				<circle cx="118" cy="120" r="7" fill="rgba(255,100,100,0.5)" />
				<circle cx="130" cy="120" r="7" fill="rgba(255,160,60,0.7)" />
				<rect x="18" y="130" width="140" height="3" rx="0" fill="var(--surface-4)" />
				<rect x="18" y="130" width="3" height="3" rx="0" fill="var(--accent)" />
				<rect
					x="110"
					y="42"
					width="66"
					height="28"
					rx="10"
					fill="var(--card)"
					stroke="var(--success-border)"
					stroke-width="1"
				/>
				<circle cx="124" cy="56" r="5" fill="rgba(80,200,120,0.2)" />
				<circle cx="124" cy="56" r="2.5" fill="rgba(80,200,120,0.8)" />
				<text
					x="133"
					y="53"
					font-family="DM Sans,sans-serif"
					font-size="8"
					fill="var(--text-secondary)"
					font-weight="400">{m.account_budget_label()}</text
				>
				<text
					x="133"
					y="63"
					font-family="DM Sans,sans-serif"
					font-size="10"
					fill="var(--success)"
					font-weight="500">+₴2 000</text
				>
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

	<div class="slide-bottom pb-12">
		<Button
			variant="primary"
			size="lg"
			class="w-full text-base rounded-[18px] flex items-center justify-center gap-3 py-6"
			onclick={toggleGoogle}
		>
			<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
				<path
					d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					fill="#4285F4"
				/>
				<path
					d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					fill="#34A853"
				/>
				<path
					d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
					fill="#FBBC05"
				/>
				<path
					d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
					fill="#EA4335"
				/>
			</svg>
			Continue with Google
		</Button>
	</div>
</div>

<style>
	.glow-1 {
		width: 260px;
		height: 200px;
		left: -40px;
		top: -40px;
		background: radial-gradient(ellipse, rgba(60, 100, 255, 0.35) 0%, transparent 70%);
	}
	.glow-2 {
		width: 180px;
		height: 180px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(ellipse, rgba(120, 60, 220, 0.25) 0%, transparent 70%);
		animation-delay: 2s;
	}
	.ill {
		position: relative;
		z-index: 2;
		animation: float 3.5s ease-in-out infinite;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-10px);
		}
	}
</style>
