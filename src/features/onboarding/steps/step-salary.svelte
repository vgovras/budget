<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';
	import MoneyInput from '$lib/ui/money-input/money-input.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		value = $bindable<number | null>(null),
		onNext
	}: { value: number | null; onNext: () => void } = $props();
</script>

<div class="step">
	<div class="step-icon"><Icon name="wallet" size={48} /></div>
	<h2 class="step-title">{m.onboarding_salary_title()}</h2>
	<p class="step-desc">{m.onboarding_salary_desc()}</p>
	<div class="input-wrap">
		<MoneyInput bind:value placeholder="30 000" size="md" />
	</div>
	<button class="step-btn" disabled={!value || value <= 0} onclick={onNext}
		>{m.button_next()}</button
	>
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
	.step-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-mid);
	}
	.step-title {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: -0.03em;
		color: var(--text-hi);
	}
	.step-desc {
		font-size: 15px;
		color: var(--text-mid);
	}
	.input-wrap {
		padding: 16px 20px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: var(--r-md);
		width: 100%;
		max-width: 260px;
	}
	.step-btn {
		margin-top: 16px;
		padding: 16px 48px;
		border-radius: var(--r-md);
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
		font-size: 17px;
		font-weight: 600;
		cursor: pointer;
		font-family: var(--font);
		transition: all 0.2s ease;
	}
	.step-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}
	.step-btn:not(:disabled):hover {
		background: rgba(255, 255, 255, 0.12);
	}
</style>
