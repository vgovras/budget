<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import Icon from '$lib/ui/icon/icon.svelte';
	import type { Snippet } from 'svelte';

	let {
		icon,
		label,
		description,
		right,
		onclick,
		variant = 'default',
		class: className
	}: {
		icon?: string;
		label: string;
		description?: string;
		right?: Snippet;
		onclick?: () => void;
		variant?: 'default' | 'danger';
		class?: string;
	} = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class={cn(
		'flex items-center gap-3.5 px-4 py-3.5 relative transition-colors duration-150',
		onclick && 'cursor-pointer hover:bg-surface-3',
		className
	)}
	{onclick}
>
	{#if icon}
		<div class="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 bg-surface-5">
			<Icon name={icon} size={18} />
		</div>
	{/if}
	<div class="flex-1 min-w-0">
		<div class={cn('text-base text-text-hi', variant === 'danger' && 'text-danger')}>{label}</div>
		{#if description}
			<div class="text-s text-text-lo font-mono mt-px">{description}</div>
		{/if}
	</div>
	{#if right}
		<div class="flex items-center gap-2 text-text-lo shrink-0">
			{@render right()}
		</div>
	{/if}
</div>
