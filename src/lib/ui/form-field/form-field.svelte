<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label = '',
		hint = '',
		children
	}: {
		label?: string;
		hint?: string;
		children: Snippet;
	} = $props();
</script>

<div class="flex flex-col gap-1.5">
	{#if label}
		<span class="text-sm font-medium text-text-mid pl-0.5">{label}</span>
	{/if}
	{@render children()}
	{#if hint}
		<span class="text-xs text-text-lo pl-0.5">{hint}</span>
	{/if}
</div>
