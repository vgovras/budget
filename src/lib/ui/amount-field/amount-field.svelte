<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children
	}: {
		children: Snippet;
	} = $props();
</script>

<div class="px-4.5 py-4 bg-surface-3 border border-surface-7 rounded-md transition-all duration-200 ease-in-out focus-within:border-surface-16 focus-within:shadow-[0_0_0_1px_var(--surface-5)]">
	{@render children()}
</div>
