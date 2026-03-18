<script lang="ts">
	import { cn } from '$lib/utils/cn.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'default' | 'secondary' | 'ghost' | 'destructive';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'default',
		size = 'md',
		class: className,
		children,
		...rest
	}: HTMLButtonAttributes & {
		variant?: Variant;
		size?: Size;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();

	const variants: Record<Variant, string> = {
		default: 'bg-surface-8 border border-surface-14 text-text-hi hover:bg-surface-12',
		secondary: 'bg-surface-4 border border-border text-text-hi hover:bg-surface-8',
		ghost: 'bg-transparent text-text-mid hover:bg-surface-5',
		destructive: 'bg-danger-bg border border-danger-border text-danger hover:brightness-125'
	};

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm rounded-[10px]',
		md: 'px-4 py-3 text-[15px] rounded-md',
		lg: 'w-full py-4 text-[17px] rounded-md'
	};
</script>

<button
	class={cn(
		'inline-flex items-center justify-center font-sans font-semibold transition-all duration-150 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed',
		variants[variant],
		sizes[size],
		className
	)}
	{...rest}
>
	{#if children}{@render children()}{/if}
</button>
