<script lang="ts">
	let {
		value = 0,
		variant = 'default',
		class: className = ''
	}: {
		value?: number;
		variant?: 'default' | 'green';
		class?: string;
	} = $props();

	const clamped = $derived(Math.max(0, Math.min(100, value)));
</script>

<div class="h-0.5 rounded-full bg-surface-7 {className}">
	<div
		class="h-full rounded-full transition-[width] duration-800 ease-out {variant === 'green' ? 'bg-success-dim' : 'bg-accent-dim'}"
		style="width:{clamped}%"
	></div>
</div>
