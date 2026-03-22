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
<div class="date-picker" onclick={() => inputEl?.showPicker?.()}>
	<input
		bind:this={inputEl}
		class="date-input"
		type="date"
		bind:value
	/>
</div>

<style>
	.date-picker {
		position: relative;
		cursor: pointer;
	}

	.date-input {
		width: 100%;
		padding: 12px 16px;
		border-radius: var(--r-sm);
		border: 1px solid rgba(255, 255, 255, 0.09);
		background: rgba(255, 255, 255, 0.05);
		font-size: 15px;
		color: var(--text-hi);
		font-family: var(--font);
		outline: none;
		transition: border-color 0.2s ease;
		cursor: pointer;
		color-scheme: dark;
		-webkit-appearance: none;
		appearance: none;
	}
	.date-input:focus {
		border-color: rgba(255, 255, 255, 0.16);
	}

	.date-input::-webkit-calendar-picker-indicator {
		filter: invert(0.8) sepia(0.1) hue-rotate(180deg);
		cursor: pointer;
		padding: 2px;
		border-radius: 4px;
		transition: background 0.15s ease;
	}
	.date-input::-webkit-calendar-picker-indicator:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
