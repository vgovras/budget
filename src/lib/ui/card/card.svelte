<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

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

<div
	class="{variant === 'led' ? 'card-led' : ''} bg-card border border-border relative shrink-0 {variant === 'led' ? 'rounded-xl overflow-hidden' : 'rounded-lg'} {className}"
	in:fade={{ duration: 300 }}
>
	{@render children()}
</div>

<style>
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
