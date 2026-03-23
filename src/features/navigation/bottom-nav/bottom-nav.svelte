<script lang="ts">
	import { BottomNavViewModel } from './bottom-nav.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let { onAdd }: { onAdd?: () => void } = $props();

	const vm = new BottomNavViewModel();
</script>

<nav
	class="fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-3 py-2 rounded-xl border border-border transition-all duration-500 ease-out backdrop-blur-xl backdrop-saturate-[1.2] bg-[var(--card)]/80
		{vm.navVisible ? '' : '-translate-y-0 translate-y-[calc(100%+32px)] opacity-0 pointer-events-none'}"
>
	{#each vm.tabs as tab, i (tab.id)}
		{#if i === 2}
			<button
				class="w-11 h-11 grid place-items-center rounded-sm border border-accent-border bg-accent-glow text-accent transition-all duration-200 active:scale-[0.93]"
				onclick={onAdd}
			>
				<Icon name="plus" size={20} />
			</button>
		{/if}
		<button
			class="w-11 h-11 grid place-items-center rounded-full transition-all duration-200
				{vm.currentScreen === tab.id
					? 'text-text-hi bg-surface-5 border border-border-hi'
					: 'text-text-lo'}"
			onclick={() => vm.goTo(tab.id)}
		>
			<Icon name={tab.icon} size={22} />
		</button>
	{/each}
</nav>
