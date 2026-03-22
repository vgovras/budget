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

<div class="field">
	{#if label}
		<span class="field-label">{label}</span>
	{/if}
	{@render children()}
	{#if hint}
		<span class="field-hint">{hint}</span>
	{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.field-label {
		font-size: 13px;
		font-weight: 500;
		color: var(--text-mid);
		padding-left: 2px;
	}
	.field-hint {
		font-size: 11px;
		color: var(--text-lo);
		padding-left: 2px;
	}
</style>
