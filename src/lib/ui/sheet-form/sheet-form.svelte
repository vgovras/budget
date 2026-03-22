<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title = '',
		children
	}: {
		title?: string;
		children: Snippet;
	} = $props();
</script>

<div class="flex flex-col gap-4">
	{#if title}
		<h3 class="text-xl font-bold tracking-tight text-text-hi text-center">{title}</h3>
	{/if}
	{@render children()}
</div>
