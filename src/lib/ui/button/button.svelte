<script lang="ts">
	import { cn } from '$lib/utils/cn.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant =
		| 'default'
		| 'secondary'
		| 'ghost'
		| 'destructive'
		| 'accent'
		| 'soft'
		| 'primary'
		| 'gradient'
		| 'outline';
	type Size = 'sm' | 'md' | 'lg';

	let {
		variant = 'default',
		size = 'md',
		class: className,
		children,
		...rest
	}: HTMLButtonAttributes & {
		variant?: Variant;
		size?: Size;
		class?: string;
		children?: import('svelte').Snippet;
	} = $props();
</script>

<button
	class={cn('btn-base', `btn-${variant}`, `btn-${size}`, className)}
	{...rest}
>
	{#if children}{@render children()}{/if}
</button>

<style>
	.btn-base {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s ease;
	}
	.btn-base:disabled {
		opacity: 0.22;
		cursor: not-allowed;
	}

	/* ── Sizes ── */
	.btn-sm {
		padding: 6px 12px;
		font-size: 14px;
		border-radius: 10px;
	}
	.btn-md {
		padding: 12px 16px;
		font-size: 15px;
		border-radius: var(--r-md);
	}
	.btn-lg {
		width: 100%;
		padding: 17px;
		font-size: 17px;
		border-radius: var(--r-md);
	}

	/* ── Variants ── */
	.btn-default {
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.14);
		color: var(--text-hi);
	}
	.btn-default:hover {
		background: rgba(255, 255, 255, 0.12);
	}

	.btn-secondary {
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
	}
	.btn-secondary:hover {
		background: rgba(255, 255, 255, 0.07);
	}

	.btn-ghost {
		background: transparent;
		border: none;
		color: var(--text-mid);
	}
	.btn-ghost:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.btn-destructive {
		background: var(--danger-bg);
		border: 1px solid var(--danger-border);
		color: var(--danger);
	}
	.btn-destructive:hover {
		background: rgba(255, 100, 100, 0.16);
	}

	.btn-accent {
		background: rgba(80, 130, 255, 0.08);
		border: 1px solid rgba(80, 130, 255, 0.25);
		color: var(--accent);
	}
	.btn-accent:not(:disabled):hover {
		background: rgba(80, 130, 255, 0.14);
		border-color: rgba(80, 130, 255, 0.3);
	}
	.btn-accent:disabled {
		border-color: rgba(255, 255, 255, 0.07);
	}

	.btn-soft {
		background: rgba(221, 232, 240, 0.09);
		border: 1px solid rgba(221, 232, 240, 0.25);
		color: #fff;
		font-weight: 600;
		box-shadow:
			inset 0 1px 0 rgba(221, 232, 240, 0.35),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			0 0 24px rgba(221, 232, 240, 0.12),
			0 6px 20px rgba(0, 0, 0, 0.35);
	}
	.btn-soft:not(:disabled):hover {
		background: rgba(221, 232, 240, 0.14);
		border-color: rgba(221, 232, 240, 0.4);
	}
	.btn-soft:disabled {
		box-shadow: none;
		border-color: var(--border);
	}

	.btn-primary {
		background: rgba(255, 255, 255, 0.95);
		border: none;
		color: #08080f;
	}
	.btn-primary:hover {
		background: #fff;
	}

	.btn-gradient {
		background: linear-gradient(135deg, rgba(60, 100, 255, 0.8), rgba(120, 60, 220, 0.8));
		border: none;
		color: #fff;
		box-shadow: 0 8px 24px rgba(60, 100, 255, 0.25);
	}

	.btn-outline {
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.45);
		font-weight: 400;
	}
	.btn-outline:hover {
		border-color: rgba(255, 255, 255, 0.2);
	}
</style>
