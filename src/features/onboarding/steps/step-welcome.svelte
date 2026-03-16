<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';
	import Dropdown from '$lib/ui/dropdown/dropdown.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getLocale, setLocale, locales } from '$lib/paraglide/runtime.js';
	import { LANG_OPTIONS } from '$lib/utils/locale.js';

	let { onNext }: { onNext: () => void } = $props();

	let locale = $state(getLocale());

	$effect(() => {
		if (locale !== getLocale()) {
			setLocale(locale as typeof locales[number]);
		}
	});
</script>

<div class="step">
	<div class="step-center">
		<div class="step-icon"><Icon name="sparkles" size={64} /></div>
		<h2 class="step-title">{m.onboarding_welcome_title()}</h2>
		<p class="step-desc">{m.onboarding_welcome_desc()}</p>

		<div class="btn-wrap">
			<span class="aurora-glow"></span>
			<button class="step-btn" onclick={onNext}>
				<span class="aurora-bg"></span>
				<span class="btn-text">{m.button_start()}</span>
			</button>
		</div>
	</div>

	<div class="lang-bottom">
		<Dropdown bind:value={locale} options={LANG_OPTIONS} position="top" />
	</div>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40px 24px;
		text-align: center;
		height: 100%;
	}
	.step-center {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
		margin: auto 0;
	}
	.step-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-mid);
	}
	.step-title {
		font-size: 28px;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}
	.step-desc {
		font-size: 16px;
		color: var(--text-mid);
		line-height: 1.5;
		max-width: 280px;
	}
	.btn-wrap {
		position: relative;
		margin-top: 24px;
	}
	.lang-bottom {
		margin-top: auto;
		padding-bottom: 16px;
	}

	.aurora-glow {
		position: absolute;
		inset: -8px;
		border-radius: 30px;
		background:
			radial-gradient(circle at 20% 50%, rgba(140, 70, 220, 0.5) 0%, transparent 50%),
			radial-gradient(circle at 80% 30%, rgba(40, 180, 120, 0.4) 0%, transparent 45%),
			radial-gradient(circle at 60% 80%, rgba(220, 110, 60, 0.35) 0%, transparent 50%);
		background-size: 200% 200%, 200% 200%, 200% 200%;
		filter: blur(28px);
		opacity: 0.6;
		animation: aurora 8s ease-in-out infinite;
		pointer-events: none;
	}

	.step-btn {
		position: relative;
		padding: 18px 56px;
		border-radius: 22px;
		border: none;
		background: rgba(0, 0, 0, 0.3);
		color: #fff;
		font-size: 17px;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font);
		overflow: hidden;
		isolation: isolate;
	}

	.aurora-bg {
		position: absolute;
		inset: -12px;
		border-radius: inherit;
		background:
			radial-gradient(circle at 20% 50%, rgba(140, 70, 220, 0.55) 0%, transparent 50%),
			radial-gradient(circle at 80% 30%, rgba(40, 180, 120, 0.45) 0%, transparent 45%),
			radial-gradient(circle at 60% 80%, rgba(220, 110, 60, 0.4) 0%, transparent 50%);
		background-size: 200% 200%, 200% 200%, 200% 200%;
		filter: blur(18px);
		animation: aurora 8s ease-in-out infinite;
		z-index: -1;
	}

	.btn-text {
		position: relative;
		z-index: 1;
	}

	@keyframes aurora {
		0% {
			background-position: 0% 50%, 100% 0%, 50% 100%;
		}
		25% {
			background-position: 100% 20%, 0% 100%, 100% 40%;
		}
		50% {
			background-position: 50% 100%, 60% 50%, 0% 0%;
		}
		75% {
			background-position: 10% 0%, 100% 80%, 60% 60%;
		}
		100% {
			background-position: 0% 50%, 100% 0%, 50% 100%;
		}
	}
</style>
