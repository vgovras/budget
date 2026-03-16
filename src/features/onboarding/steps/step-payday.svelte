<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let {
		value = $bindable<number>(1),
		onNext
	}: { value: number; onNext: () => void } = $props();

	const days = Array.from({ length: 31 }, (_, i) => i + 1);
</script>

<div class="step">
	<div class="step-icon"><Icon name="calendar" size={48} /></div>
	<h2 class="step-title">{m.onboarding_payday_title()}</h2>
	<p class="step-desc">{m.onboarding_payday_desc()}</p>

	<div class="days-grid">
		{#each days as day}
			<button
				class="day-btn"
				class:active={value === day}
				onclick={() => (value = day)}
			>
				{day}
			</button>
		{/each}
	</div>

	<button class="step-btn" onclick={onNext}>{m.button_next()}</button>
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
	.days-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 8px;
		width: 100%;
		max-width: 320px;
		padding: 4px 0;
	}
	.day-btn {
		width: 40px;
		height: 40px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-mid);
		font-size: 15px;
		font-weight: 500;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.day-btn.active {
		background: rgba(255, 255, 255, 0.14);
		border-color: rgba(255, 255, 255, 0.2);
		color: var(--text-hi);
		font-weight: 600;
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
	.step-btn:not(:disabled):hover {
		background: rgba(255, 255, 255, 0.12);
	}
</style>
