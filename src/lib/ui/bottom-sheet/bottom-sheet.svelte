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
			<div class="w-9 h-1 rounded-full bg-surface-16 mx-auto mb-0.5"></div>
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
		animation: sheet-fade-in 0.3s ease;
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
		background: var(--card);
		border-radius: var(--r-xl) var(--r-xl) 0 0;
		border: 1px solid var(--border);
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
		padding: 0 4px calc(36px + env(safe-area-inset-bottom));
		display: flex;
		flex-direction: column;
		gap: 18px;
	}
	.sheet-body::-webkit-scrollbar {
		display: none;
	}

	@keyframes sheet-slide-up {
		from { transform: translateY(100%); }
	}
	@keyframes sheet-fade-in {
		from { opacity: 0; }
	}
</style>
