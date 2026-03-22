<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div class="amount-field">
	{@render children()}
</div>

<style>
	.amount-field {
		padding: 16px 18px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: var(--r-md);
		transition: all 0.2s ease;
	}
	.amount-field:focus-within {
		border-color: rgba(255, 255, 255, 0.16);
		box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
	}
</style>
