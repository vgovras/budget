<script lang="ts">
	// import Button from '$lib/ui/button/button.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import Icon from '$lib/ui/icon/icon.svelte';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { authClient } from '$lib/auth-client';
	import GoogleIcon from '$lib/ui/icon/google-icon.svelte';

	let { onNext }: { onNext: () => void } = $props();

	let locale = $state(getLocale());
	const session = authClient.useSession();
	const isLoggedIn = $derived(!!$session.data);

	async function toggleGoogle() {
		await authClient.signIn.social({ provider: 'google' });
	}

	$effect(() => {
		if (isLoggedIn) {
			// Call your piece of code here
			console.log('User just logged in!');
			onNext();
		}
	});

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as (typeof locales)[number]);
		}
	});
</script>

<div class="slide-layout">
	<div class="slide-visual h-64">
		<div class="glow-orb glow-1"></div>
		<div class="glow-orb glow-2"></div>
		<div class="ill flex items-center justify-center">
			<div
				class="w-24 h-24 rounded-3xl bg-surface-5 border border-surface-8 flex items-center justify-center shadow-2xl"
			>
				<Icon name="lock" size={40} class="text-accent" />
			</div>
		</div>
	</div>

	<div class="slide-text-block">
		<h2 class="slide-title">Let’s get started</h2>
		<p class="slide-desc">
			Create your account to unlock personalized insights and effortless tracking.
		</p>
	</div>

	<div class="flex-1 flex items-center justify-center">
		<div class="flex items-center gap-3">
			<Dropdown bind:value={locale} options={LANG_OPTIONS} position="top" />
			<div
				class="w-[48px] h-[40px] rounded-sm flex items-center justify-center shrink-0 bg-surface-5 border border-surface-8 text-text-mid cursor-pointer transition-all duration-200 active:scale-95"
				onclick={() => settingsVM.toggleTheme()}
			>
				<Icon name={settingsVM.theme === 'dark' ? 'sun' : 'moon'} size={16} />
			</div>
		</div>
	</div>

	<!-- Socials -->
	<div class="slide-bottom pb-12 flex flex-col items-center">
		<div class="settings-section-title text-center mb-3">Socials</div>
		<div class="settings-group w-full max-w-[320px]">
			<div class="settings-row auth-button-style" onclick={toggleGoogle}>
				<div class="settings-row-icon google-icon">
					<GoogleIcon size={18} />
				</div>
				<div class="settings-row-info">
					<div class="settings-row-label">Continue with Google</div>
				</div>
			</div>
		</div>
	</div>

	<style>
		/* Add these styles to transform the row into a centered button look */
		.auth-button-style {
			justify-content: center !important; /* Center the icon and text */
			gap: 12px;
			cursor: pointer;
			transition: all 0.2s ease;
			border-radius: 18px !important; /* Making it look more like a button */
			border: 1px solid var(--surface-8) !important;
		}

		.auth-button-style:active {
			transform: scale(0.97);
		}

		/* Ensure the info block doesn't take up 100% width so it stays centered */
		.auth-button-style .settings-row-info {
			flex: 0 1 auto !important;
		}

		/* Optional: hide the background of the group to make the "button" stand out */
		.settings-group {
			background: transparent !important;
			border: none !important;
		}
	</style>

	<!-- <div class="slide-bottom pb-12">
        <Button 
            variant="primary" 
            size="lg" 
            class="w-full text-base rounded-[18px] flex items-center justify-center gap-3 py-6" 
            onclick={onSignIn}
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
        </Button>
    </div> -->
</div>

<style>
	.glow-1 {
		position: absolute;
		width: 260px;
		height: 200px;
		left: -40px;
		top: -40px;
		background: radial-gradient(ellipse, rgba(60, 100, 255, 0.3) 0%, transparent 70%);
		pointer-events: none;
	}
	.glow-2 {
		position: absolute;
		width: 180px;
		height: 180px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(ellipse, rgba(120, 60, 220, 0.2) 0%, transparent 70%);
		animation: pulse 4s ease-in-out infinite;
		pointer-events: none;
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
			transform: translateY(-8px);
		}
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 1;
		}
	}
</style>
