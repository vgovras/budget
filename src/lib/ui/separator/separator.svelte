<script lang="ts">
	import { cn } from '$lib/utils/cn.js';

	let { class: className }: { class?: string } = $props();
</script>

<div class={cn('h-px bg-border mx-4', className)}></div>
