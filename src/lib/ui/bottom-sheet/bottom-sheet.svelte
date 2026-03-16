<script lang="ts">
	import { Drawer } from 'vaul-svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(false),
		children
	}: {
		open: boolean;
		children: Snippet;
	} = $props();
</script>

<Drawer.Root bind:open>
	<Drawer.Portal>
		<Drawer.Overlay class="sheet-overlay" />
		<Drawer.Content class="sheet-content">
			<div class="sheet-handle"></div>
			{@render children()}
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>

<style>
	:global(.sheet-overlay) {
		position: fixed;
		inset: 0;
		background: var(--overlay);
		z-index: 20;
		transition: opacity 0.3s ease;
	}

	:global(.sheet-content) {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
		background: rgba(14, 14, 18, 0.55);
		backdrop-filter: blur(24px) saturate(120%);
		-webkit-backdrop-filter: blur(24px) saturate(120%);
		border-radius: 28px 28px 0 0;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-bottom: none;
		z-index: 21;
		padding: 14px 20px calc(36px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 18px;
		box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.4);
		transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
		animation: sheet-slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1);
	}

	@keyframes sheet-slide-up {
		from {
			transform: translateY(100%);
		}
	}

	:global(.sheet-overlay) {
		animation: sheet-fade-in 0.3s ease;
	}

	@keyframes sheet-fade-in {
		from {
			opacity: 0;
		}
	}

	.sheet-handle {
		width: 36px;
		height: 4px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.14);
		margin: 0 auto 2px;
	}
</style>
