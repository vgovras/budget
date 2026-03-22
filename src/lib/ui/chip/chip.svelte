<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		active = false,
		onclick,
		children
	}: {
		active?: boolean;
		onclick?: () => void;
		children: Snippet;
	} = $props();
</script>

<button
	class="px-4 py-2 rounded-xl border font-sans text-sm font-medium whitespace-nowrap transition-all duration-200 active:scale-[0.96]
		{active
			? 'bg-success-bg border-success-border text-success'
			: 'bg-surface-4 border-surface-8 text-text-secondary'}"
	{onclick}
>
	{@render children()}
</button>
