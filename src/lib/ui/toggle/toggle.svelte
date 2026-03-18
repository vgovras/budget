<script lang="ts">
	import { cn } from '$lib/utils/cn.js';

	let {
		checked = $bindable(false),
		class: className,
		...rest
	}: {
		checked?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<div
	class={cn('toggle', className)}
	class:on={checked}
	role="switch"
	aria-checked={checked}
	tabindex="0"
	onclick={() => (checked = !checked)}
	onkeydown={(e) => {
		if (e.key === ' ' || e.key === 'Enter') {
			e.preventDefault();
			checked = !checked;
		}
	}}
	{...rest}
>
	<div class="toggle-handle"></div>
</div>

<style>
	.toggle {
		width: 48px;
		height: 28px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.08);
		position: relative;
		cursor: pointer;
		transition: all 0.25s ease;
		flex-shrink: 0;
	}
	.toggle.on {
		background: rgba(255, 255, 255, 0.16);
		border-color: rgba(255, 255, 255, 0.14);
	}
	.toggle-handle {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.8);
		transition: all 0.25s ease;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
	}
	.toggle.on .toggle-handle {
		left: 22px;
		background: #ffffff;
	}
</style>
