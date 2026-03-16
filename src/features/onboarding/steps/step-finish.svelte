<script lang="ts">
	import { scale, fade } from 'svelte/transition';
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="step">
	<div class="checkmark" in:scale={{ duration: 500, start: 0, delay: 100 }}>
		<Icon name="check" size={36} />
	</div>
	<h2 class="step-title" in:fade={{ duration: 400, delay: 350 }}>{m.onboarding_finish_title()}</h2>
	<p class="step-desc" in:fade={{ duration: 400, delay: 500 }}>{m.onboarding_finish_desc()}</p>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 16px;
		padding: 40px 24px;
		text-align: center;
		height: 100%;
	}

	.checkmark {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.15);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.8);
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
	}
</style>
