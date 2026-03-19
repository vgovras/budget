<script lang="ts">
	import { locale } from '$lib/utils/format.js';
	let {
		value = $bindable<number | null>(null),
		currency = '₴',
		placeholder = '0',
		size = 'lg',
		autofocus = false,
		class: className = ''
	}: {
		value: number | null;
		currency?: string;
		placeholder?: string;
		size?: 'md' | 'lg' | 'xl';
		autofocus?: boolean;
		class?: string;
	} = $props();

	let inputEl: HTMLInputElement;
	let editing = $state(false);

	const formatted = $derived(value ? value.toLocaleString(locale()) : '');

	function onFocus() {
		editing = true;
	}

	function onBlur() {
		editing = false;
	}

	function onInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const raw = input.value.replace(/[^\d]/g, '');
		value = raw ? Number(raw) : null;
	}

	function focusInput() {
		inputEl?.focus();
	}

	$effect(() => {
		if (autofocus && inputEl) {
			setTimeout(() => inputEl.focus(), 350);
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="money-input size-{size} {className}" onclick={focusInput}>
	<span class="currency">{currency}</span>
	<input
		bind:this={inputEl}
		class="input"
		type="text"
		inputmode="numeric"
		{placeholder}
		value={editing ? (value ?? '') : formatted}
		oninput={onInput}
		onfocus={onFocus}
		onblur={onBlur}
	/>
</div>

<style>
	.money-input {
		display: flex;
		align-items: baseline;
		gap: 8px;
		cursor: text;
	}

	.currency {
		font-family: var(--font-mono);
		font-weight: 300;
		color: var(--text-lo);
	}

	.input {
		flex: 1;
		font-family: var(--font-mono);
		font-weight: 300;
		letter-spacing: -0.03em;
		width: 100%;
		caret-color: var(--accent);
		color: var(--text-hi);
		background: none;
		border: none;
		outline: none;
	}
	.input::placeholder {
		color: var(--text-lo);
	}

	/* Sizes */
	.size-md .currency {
		font-size: 20px;
	}
	.size-md .input {
		font-size: 28px;
	}

	.size-lg .currency {
		font-size: 24px;
	}
	.size-lg .input {
		font-size: 36px;
	}

	.size-xl .currency {
		font-size: 14px;
	}
	.size-xl .input {
		font-size: 44px;
		letter-spacing: -0.04em;
		text-align: center;
	}
</style>
