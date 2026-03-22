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

<div class="sheet-body">
	{#if title}
		<h3 class="sheet-title">{title}</h3>
	{/if}
	{@render children()}
</div>

<style>
	.sheet-body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.sheet-title {
		font-size: 20px;
		font-weight: 700;
		letter-spacing: -0.02em;
		color: var(--text-hi);
		text-align: center;
	}
</style>
