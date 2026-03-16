<script lang="ts">
	import { BottomNavViewModel } from './bottom-nav.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let { onAdd }: { onAdd?: () => void } = $props();

	const vm = new BottomNavViewModel();
</script>

<nav class="nav" class:hidden={!vm.navVisible}>
	{#each vm.tabs as tab, i}
		{#if i === 2}
			<button class="add" onclick={onAdd}>
				<Icon name="plus" size={20} />
			</button>
		{/if}
		<button class="tab" class:active={vm.currentScreen === tab.id} onclick={() => vm.goTo(tab.id)}>
			<Icon name={tab.icon} size={22} />
		</button>
	{/each}
</nav>

<style>
	.nav {
		position: fixed;
		bottom: calc(16px + env(safe-area-inset-bottom));
		left: 50%;
		transform: translateX(-50%);
		z-index: 20;
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 8px 12px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.04);
		backdrop-filter: blur(20px) saturate(120%);
		-webkit-backdrop-filter: blur(20px) saturate(120%);
		border: 1px solid rgba(255, 255, 255, 0.08);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.06);
		transition:
			transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
			opacity 0.4s ease;
	}

	.nav.hidden {
		transform: translateX(-50%) translateY(calc(100% + 32px));
		opacity: 0;
		pointer-events: none;
	}

	.tab {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border: none;
		background: none;
		border-radius: 50%;
		color: rgba(255, 255, 255, 0.35);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab.active {
		color: #ffffff;
		background: rgba(255, 255, 255, 0.10);
	}

	.add {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.80);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add:active {
		transform: scale(0.93);
	}
</style>
