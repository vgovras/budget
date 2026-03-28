<script lang="ts">
	import type { CategoryType } from '$lib/types.js';
	import { categoriesVM } from '$features/categories/categories.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { selected, onSelect, type = 'expense' }: {
		selected: string | null;
		onSelect: (icon: string) => void;
		type?: CategoryType;
	} = $props();

	const filtered = $derived(categoriesVM.byType(type));
</script>

<div class="grid grid-cols-3 gap-2">
		{#each filtered as cat (cat.id)}
			<button
				class="flex flex-col items-center gap-1.5 px-2 py-3 rounded-sm border font-sans text-xs font-medium transition-all duration-150
					{selected === cat.icon
						? 'border-text-muted bg-surface-8 text-text-hi'
						: 'border-surface-5 bg-surface-3 text-text-hi hover:border-surface-12 hover:bg-surface-5'}"
				style:background={selected === cat.icon ? cat.bg : ''}
				style:border-color={selected === cat.icon ? cat.border : ''}
				onclick={() => onSelect(cat.icon)}
			>
				<Icon name={cat.icon} size={22} />
				{cat.label}
			</button>
		{/each}
</div>
