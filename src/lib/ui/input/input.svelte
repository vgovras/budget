<script lang="ts">
	import { cn } from '$lib/utils/cn.js';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(''),
		class: className,
		...rest
	}: HTMLInputAttributes & {
		value?: string;
		class?: string;
	} = $props();
</script>

<input
	bind:value
	class={cn(
		'w-full px-4 py-3 rounded-sm bg-surface-5 border border-surface-10 text-text-hi font-sans text-[15px] placeholder:text-text-lo transition-all duration-200 focus:border-surface-16 outline-none',
		className
	)}
	{...rest}
/>
