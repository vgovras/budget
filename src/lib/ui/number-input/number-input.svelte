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

<div class="number-input">
	{#if label}
		<span class="ni-label">{label}</span>
	{/if}
	<div class="ni-control">
		<input
			class="ni-input"
			type="number"
			{min}
			{max}
			value={value}
			oninput={handleInput}
			onblur={handleBlur}
		/>
		{#if suffix}
			<span class="ni-suffix">{suffix}</span>
		{/if}
		<div class="ni-buttons">
			<button class="ni-btn" onclick={() => (value = clamp(value + 1))}>▲</button>
			<button class="ni-btn" onclick={() => (value = clamp(value - 1))}>▼</button>
		</div>
	</div>
</div>

<style>
	.number-input {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 12px 14px;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 14px;
	}
	.ni-label {
		font-size: 14px;
		color: rgba(255, 255, 255, 0.45);
		font-weight: 400;
	}
	.ni-control {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.ni-input {
		width: 48px;
		background: transparent;
		border: none;
		outline: none;
		color: rgba(255, 255, 255, 0.9);
		font-size: 18px;
		font-weight: 600;
		font-family: var(--font);
		text-align: right;
		-moz-appearance: textfield;
	}
	.ni-input::-webkit-inner-spin-button,
	.ni-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.ni-suffix {
		font-size: 16px;
		color: rgba(255, 255, 255, 0.4);
		font-weight: 500;
	}
	.ni-buttons {
		display: flex;
		flex-direction: column;
		gap: 2px;
		margin-left: 4px;
	}
	.ni-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 18px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.4);
		font-size: 9px;
		cursor: pointer;
		transition: all 0.15s ease;
		padding: 0;
		font-family: var(--font);
	}
	.ni-btn:active {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.7);
	}
</style>
