<script lang="ts">
	import { cn } from '$lib/utils/cn.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant =
		| 'default'
		| 'secondary'
		| 'ghost'
		| 'destructive'
		| 'accent'
		| 'soft'
		| 'primary'
		| 'gradient'
		| 'outline';
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

	const base = 'inline-flex items-center justify-center font-sans font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';

	const sizes: Record<Size, string> = {
		sm: 'px-3 py-1.5 text-sm rounded-sm',
		md: 'px-4 py-3 text-base rounded-md',
		lg: 'w-full py-4 text-lg rounded-md'
	};

	const variants: Record<Variant, string> = {
		default: 'bg-surface-8 border border-surface-14 text-text-hi hover:bg-surface-12',
		secondary: 'bg-surface-4 border border-surface-8 text-text-hi hover:bg-surface-7',
		ghost: 'bg-transparent text-text-mid hover:bg-surface-5',
		destructive: 'bg-danger-bg border border-danger-border text-danger hover:bg-danger-hover',
		accent: 'bg-accent-bg border border-accent-border text-accent hover:enabled:bg-accent-hover hover:enabled:border-accent-border-hi disabled:border-border',
		soft: 'bg-soft border border-soft-border text-text-hi font-semibold shadow-soft hover:enabled:bg-soft-hover hover:enabled:border-soft-hover-border disabled:shadow-none disabled:border-border',
		primary: 'bg-primary-bg text-primary-fg font-semibold hover:opacity-85',
		gradient: 'bg-gradient-to-br from-gradient-from to-gradient-to text-text-hi shadow-gradient',
		outline: 'bg-transparent border border-border-hi text-text-mid font-normal hover:border-text-muted'
	};
</script>

<button
	class={cn(base, sizes[size], variants[variant], className)}
	{...rest}
>
	{#if children}{@render children()}{/if}
</button>
