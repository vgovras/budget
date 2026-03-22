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

<div class="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto no-scrollbar">
	{#each items as item (item.icon)}
		<button
			class="aspect-square flex items-center justify-center rounded-xl border transition-all duration-200
				{selected === item.icon
					? 'border-accent bg-accent-bg text-text-hi'
					: 'border-surface-8 bg-surface-4 text-text-lo'}"
			style:background={selected === item.icon && activeBg ? activeBg : ''}
			style:border-color={selected === item.icon && activeBorder ? activeBorder : ''}
			onclick={() => onSelect(item.icon)}
			title={item.label}
		>
			<Icon name={item.icon} size={18} />
		</button>
	{/each}
</div>
