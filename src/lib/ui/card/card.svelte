<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		variant = 'default',
		class: className = '',
		children
	}: {
		variant?: 'default' | 'led';
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class="{variant === 'led' ? 'card-led' : 'card'} {className}">
	{@render children()}
</div>

<style>
	.card {
		background: #09090e;
		border-radius: var(--r-lg);
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.07);
		flex-shrink: 0;
	}

	.card-led {
		background: #09090e;
		border-radius: var(--r-xl);
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.07);
		overflow: hidden;
		flex-shrink: 0;
	}
	.card-led::before {
		content: '';
		position: absolute;
		top: -20px;
		left: -20px;
		width: 200px;
		height: 200px;
		background: radial-gradient(ellipse, rgba(60, 100, 220, 0.18), transparent 70%);
		pointer-events: none;
		z-index: 0;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.card-led::after {
		content: '';
		position: absolute;
		bottom: -20px;
		right: -20px;
		width: 160px;
		height: 140px;
		background: radial-gradient(ellipse, rgba(120, 50, 180, 0.13), transparent 70%);
		pointer-events: none;
		z-index: 0;
		animation: glow-pulse 4s ease-in-out infinite 2s;
	}
	.card-led > :global(*) {
		position: relative;
		z-index: 1;
	}
</style>
