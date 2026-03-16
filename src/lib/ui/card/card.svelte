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
		background: rgba(22, 22, 28, 0.92);
		contain: layout paint style;
		border-radius: var(--r-lg);
		position: relative;
		border: 1px solid transparent;
		background-clip: padding-box;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.14),
			inset 1px 0 0 rgba(255, 255, 255, 0.07),
			inset 0 -1px 0 rgba(0, 0, 0, 0.25),
			0 4px 24px rgba(0, 0, 0, 0.35),
			0 1px 0 rgba(255, 255, 255, 0.04);
	}
	.card::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: var(--r-lg);
		border: 1px solid rgba(255, 255, 255, 0.08);
		pointer-events: none;
	}

	.card-led {
		background: rgba(18, 18, 24, 0.95);
		border-radius: var(--r-xl);
		position: relative;
		box-shadow:
			inset 0 1px 0 rgba(221, 232, 240, 0.28),
			inset 1px 0 0 rgba(221, 232, 240, 0.1),
			inset -1px 0 0 rgba(221, 232, 240, 0.04),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3),
			0 0 0 1px rgba(221, 232, 240, 0.14),
			0 0 40px rgba(221, 232, 240, 0.06),
			0 16px 48px rgba(0, 0, 0, 0.55);
	}
	.card-led::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 50%;
		border-radius: var(--r-xl) var(--r-xl) 0 0;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.055) 0%,
			rgba(255, 255, 255, 0.01) 60%,
			transparent 100%
		);
		pointer-events: none;
		z-index: 0;
	}
	.card-led > :global(*) {
		position: relative;
		z-index: 1;
	}
</style>
