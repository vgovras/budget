<script lang="ts">
	import { cn } from '$lib/utils/cn.js';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children
	}: {
		class?: string;
		children: Snippet;
	} = $props();
</script>

<span class={cn('font-mono text-[15px] font-medium text-text-mid', className)}>
	{@render children()}
</span>
