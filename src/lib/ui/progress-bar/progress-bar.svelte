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

<div class="track {className}">
	<div class="fill" class:green={variant === 'green'} style="width:{clamped}%"></div>
</div>

<style>
	.track {
		height: 2px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.07);
	}
	.fill {
		height: 100%;
		border-radius: 99px;
		background: rgba(80, 130, 255, 0.5);
		transition: width 0.8s var(--ease-out, ease);
	}
	.fill.green {
		background: rgba(80, 200, 120, 0.6);
	}
</style>
