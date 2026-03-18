<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
		class: className
	}: {
		title?: string;
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div>
	{#if title}
		<div class="text-xs font-semibold tracking-widest uppercase text-text-lo px-1 pb-2">
			{title}
		</div>
	{/if}
	<div
		class={cn(
			'bg-card rounded-lg border border-border shadow-[0_4px_16px_rgba(0,0,0,0.2)] overflow-hidden',
			className
		)}
	>
		{@render children()}
	</div>
</div>

<style>
	div > div:last-child > :global(*:not(:last-child)) {
		position: relative;
	}
	div > div:last-child > :global(*:not(:last-child))::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 1rem;
		right: 1rem;
		height: 1px;
		background: var(--border);
	}
</style>
