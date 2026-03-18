<script lang="ts">
	import { BottomNavViewModel } from './bottom-nav.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let { onAdd }: { onAdd?: () => void } = $props();

	const vm = new BottomNavViewModel();
</script>

<nav class="nav" class:hidden={!vm.navVisible}>
	{#each vm.tabs as tab, i (tab.id)}
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
		border-radius: 28px;
		background: #09090e;
		border: 1px solid rgba(255, 255, 255, 0.07);
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
		color: rgba(255, 255, 255, 0.25);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tab.active {
		color: rgba(255, 255, 255, 0.8);
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.add {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border-radius: 14px;
		border: 1px solid rgba(80, 130, 255, 0.25);
		background: rgba(80, 130, 255, 0.15);
		color: rgba(120, 170, 255, 0.8);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add:active {
		transform: scale(0.93);
	}

</style>
