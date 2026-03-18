<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { scrollNav } from '$lib/utils/scroll-nav';
	import type { Snippet } from 'svelte';

	let {
		title,
		children,
		header,
		gap = 'gap-6',
		class: className
	}: {
		title: string;
		children: Snippet;
		header?: Snippet;
		gap?: string;
		class?: string;
	} = $props();
</script>

<div class="flex items-center gap-3 px-4 pt-4 pb-2.5 shrink-0 w-full max-w-[600px] mx-auto">
	<span class="text-xl font-bold tracking-tight text-text-hi">{title}</span>
</div>

{#if header}{@render header()}{/if}

<div
	class={cn(
		'flex-1 min-h-0 overflow-y-auto px-4 pb-[calc(100px+env(safe-area-inset-bottom))] flex flex-col w-full max-w-[600px] mx-auto no-scrollbar',
		gap,
		className
	)}
	use:scrollNav
>
	{@render children()}
</div>
