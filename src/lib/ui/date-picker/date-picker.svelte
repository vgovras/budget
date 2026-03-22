<script lang="ts">
	import { locale } from '$lib/utils/format.js';
	import Icon from '$lib/ui/icon/icon.svelte';

	let {
		value = $bindable('')
	}: {
		value?: string;
	} = $props();

	let inputEl: HTMLInputElement;

	const formatted = $derived(() => {
		if (!value) return '';
		const [y, m, d] = value.split('-').map(Number);
		const date = new Date(y, m - 1, d);
		return date.toLocaleDateString(locale(), { day: 'numeric', month: 'long', year: 'numeric' });
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex items-center justify-between px-4 py-3 rounded-sm border border-surface-8 bg-surface-5 cursor-pointer transition-[border-color] duration-200 hover:border-surface-16"
	onclick={() => inputEl?.showPicker?.()}
>
	<span class="text-base text-text-hi">{formatted()}</span>
	<Icon name="calendar" size={16} class="text-text-lo" />
	<input
		bind:this={inputEl}
		class="sr-only"
		type="date"
		bind:value
	/>
</div>
