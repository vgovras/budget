<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		active = false,
		onclick,
		children
	}: {
		active?: boolean;
		onclick?: () => void;
		children: Snippet;
	} = $props();
</script>

<button class="chip" class:active {onclick}>
	{@render children()}
</button>

<style>
	.chip {
		padding: 8px 16px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.5);
		font-size: 14px;
		font-weight: 500;
		font-family: var(--font);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}
	.chip:active {
		transform: scale(0.96);
	}
	.chip.active {
		background: rgba(80, 200, 120, 0.15);
		border-color: rgba(80, 200, 120, 0.4);
		color: rgba(80, 200, 120, 0.9);
	}
</style>
