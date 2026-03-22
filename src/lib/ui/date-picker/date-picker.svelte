<script lang="ts">
	let {
		value = $bindable('')
	}: {
		value?: string;
	} = $props();

	let inputEl: HTMLInputElement;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative cursor-pointer" onclick={() => inputEl?.showPicker?.()}>
	<input
		bind:this={inputEl}
		class="w-full px-4 py-3 rounded-sm border border-surface-8 bg-surface-5 text-base text-text-hi font-sans cursor-pointer transition-[border-color] duration-200 focus:border-surface-16 [color-scheme:dark] appearance-none"
		type="date"
		bind:value
	/>
</div>

<style>
	input::-webkit-calendar-picker-indicator {
		filter: invert(0.8) sepia(0.1) hue-rotate(180deg);
		cursor: pointer;
		padding: 2px;
		border-radius: 4px;
		transition: background 0.15s ease;
	}
	input::-webkit-calendar-picker-indicator:hover {
		background: var(--border-hi);
	}
</style>
