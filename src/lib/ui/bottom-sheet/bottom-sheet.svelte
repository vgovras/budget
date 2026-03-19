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

<Drawer.Root bind:open scrollLockTimeout={0}>
	<Drawer.Portal>
		<Drawer.Overlay class="sheet-overlay" />
		<Drawer.Content class="sheet-content">
			<div class="sheet-handle"></div>
			<div class="sheet-body" data-vaul-no-drag>
				{@render children()}
			</div>
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
		max-height: 85vh;
		margin: 0 auto;
		background: #09090e;
		border-radius: 28px 28px 0 0;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-bottom: none;
		z-index: 21;
		padding: 14px 20px 0;
		display: flex;
		flex-direction: column;
		box-shadow: 0 -16px 48px rgba(0, 0, 0, 0.4);
		transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
		animation: sheet-slide-up 0.35s cubic-bezier(0.32, 0.72, 0, 1);
	}

	.sheet-body {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		overscroll-behavior: contain;
		scrollbar-width: none;
		padding: 0 0 calc(36px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.sheet-body::-webkit-scrollbar {
		display: none;
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
		background: rgba(255, 255, 255, 0.15);
		margin: 0 auto 2px;
	}
</style>
