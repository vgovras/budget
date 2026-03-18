<script lang="ts">
	import { categoriesVM } from '$features/categories/categories.svelte.js';
	import Icon from '$lib/ui/icon/icon.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { selected, onSelect }: { selected: string | null; onSelect: (icon: string) => void } =
		$props();
</script>

<div>
	<div class="cat-label">{m.label_category()}</div>
	<div class="categories">
		{#each categoriesVM.categories as cat (cat.icon)}
			<button
				class="cat-btn"
				class:selected={selected === cat.icon}
				onclick={() => onSelect(cat.icon)}
			>
				<Icon name={cat.icon} size={22} />
				{cat.label}
			</button>
		{/each}
	</div>
</div>

<style>
	.cat-label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-lo);
		margin-bottom: 8px;
	}

	.categories {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8px;
	}

	.cat-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 12px 8px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.06);
		background: rgba(255, 255, 255, 0.03);
		color: var(--text-hi);
		font-size: 12px;
		font-weight: 500;
		transition: all 0.18s ease;
		font-family: var(--font);
		cursor: pointer;
		box-shadow: none;
	}

	.cat-btn:hover {
		border-color: rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.06);
		box-shadow: none;
		transform: none;
	}

	.cat-btn.selected {
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
		box-shadow: none;
	}
</style>
