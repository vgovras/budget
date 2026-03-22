<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';

	let {
		icons,
		selected = '',
		onSelect,
		activeBg = '',
		activeBorder = ''
	}: {
		icons: { icon: string; label?: string }[] | string[];
		selected?: string;
		onSelect: (icon: string) => void;
		activeBg?: string;
		activeBorder?: string;
	} = $props();

	const items = $derived(
		icons.map((i) => (typeof i === 'string' ? { icon: i, label: i } : i))
	);
</script>

<div class="icon-grid">
	{#each items as item (item.icon)}
		<button
			class="icon-btn"
			class:active={selected === item.icon}
			style:background={selected === item.icon && activeBg ? activeBg : ''}
			style:border-color={selected === item.icon && activeBorder ? activeBorder : ''}
			onclick={() => onSelect(item.icon)}
			title={item.label}
		>
			<Icon name={item.icon} size={18} />
		</button>
	{/each}
</div>

<style>
	.icon-grid {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: 8px;
		max-height: 160px;
		overflow-y: auto;
		scrollbar-width: none;
	}
	.icon-grid::-webkit-scrollbar {
		display: none;
	}

	.icon-btn {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.04);
		color: var(--text-lo);
		cursor: pointer;
		transition: all 0.2s ease;
		font-family: var(--font);
	}
	.icon-btn.active {
		border-color: var(--accent);
		background: rgba(80, 130, 255, 0.12);
		color: var(--text-hi);
	}
</style>
