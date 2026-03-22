<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div class="actions">
	{@render children()}
</div>

<style>
	.actions {
		display: flex;
		gap: 10px;
	}
</style>
