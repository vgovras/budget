<script lang="ts">
	import { getNoteSuggestions } from './note-input.js';
	import type { Expense } from '$lib/types.js';
	import * as m from '$lib/paraglide/messages.js';

	let { value = $bindable(''), expenses }: { value: string; expenses: Expense[] } = $props();

	const suggestions = $derived(getNoteSuggestions(expenses, value));
</script>

<input
	class="note-field"
	type="text"
	placeholder={m.placeholder_note()}
	autocomplete="off"
	bind:value
/>

{#if suggestions.length > 0 && value}
	<div class="note-suggestions">
		{#each suggestions as sug (sug)}
			<button class="note-sug" onclick={() => (value = sug)}>{sug}</button>
		{/each}
	</div>
{/if}

<style>
	.note-field {
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 15px;
		width: 100%;
		transition: all 0.2s ease;
		color: var(--text-hi);
		font-family: var(--font);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.12);
	}
	.note-field::placeholder {
		color: var(--text-mid);
	}
	.note-field:focus {
		border-color: rgba(255, 255, 255, 0.18);
		outline: none;
	}

	.note-suggestions {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}

	.note-sug {
		padding: 5px 12px;
		border-radius: 99px;
		border: 1px solid var(--border-hi);
		background: rgba(255, 255, 255, 0.04);
		font-size: 12px;
		color: var(--text-mid);
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.15s ease;
		font-family: var(--font);
	}
	.note-sug:hover {
		background: rgba(255, 255, 255, 0.08);
		color: var(--text-hi);
	}
</style>
