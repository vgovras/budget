<script lang="ts">
	let {
		value = $bindable(0),
		min = 0,
		max = 100,
		label = '',
		suffix = ''
	}: {
		value?: number;
		min?: number;
		max?: number;
		label?: string;
		suffix?: string;
	} = $props();

	function clamp(v: number) {
		return Math.max(min, Math.min(max, Math.round(v)));
	}

	function handleInput(e: Event) {
		const val = parseInt((e.target as HTMLInputElement).value);
		value = clamp(isNaN(val) ? min : val);
	}

	function handleBlur(e: FocusEvent) {
		const val = parseInt((e.target as HTMLInputElement).value);
		value = clamp(isNaN(val) ? min : val);
	}
</script>

<div class="flex items-center justify-between px-3.5 py-3 bg-surface-3 border border-surface-8 rounded-sm">
	{#if label}
		<span class="text-sm text-text-mid">{label}</span>
	{/if}
	<div class="flex items-center gap-1">
		<input
			class="w-12 bg-transparent text-right text-lg font-semibold font-sans text-text-hi [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
			type="number"
			{min}
			{max}
			value={value}
			oninput={handleInput}
			onblur={handleBlur}
		/>
		{#if suffix}
			<span class="text-base text-text-mid font-medium">{suffix}</span>
		{/if}
		<div class="flex flex-col gap-0.5 ml-1">
			<button class="flex items-center justify-center w-6 h-[18px] border border-border-hi rounded-[5px] bg-surface-4 text-text-mid text-2xs transition-all duration-150 active:bg-surface-10 active:text-text-primary" onclick={() => (value = clamp(value + 1))}>▲</button>
			<button class="flex items-center justify-center w-6 h-[18px] border border-border-hi rounded-[5px] bg-surface-4 text-text-mid text-2xs transition-all duration-150 active:bg-surface-10 active:text-text-primary" onclick={() => (value = clamp(value - 1))}>▼</button>
		</div>
	</div>
</div>
