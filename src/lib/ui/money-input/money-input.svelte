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
		size?: 'sm' | 'md' | 'lg' | 'xl';
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

	const sizeClasses = {
		sm: { currency: 'text-base', input: 'text-base' },
		md: { currency: 'text-xl', input: 'text-[1.75rem]' },
		lg: { currency: 'text-2xl', input: 'text-4xl' },
		xl: { currency: 'text-sm', input: 'text-[2.75rem] tracking-tighter text-center' }
	} as const;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="flex items-baseline gap-2 cursor-text {className}" onclick={focusInput}>
	<span class="font-mono text-text-lo {sizeClasses[size].currency}">{currency}</span>
	<input
		bind:this={inputEl}
		class="flex-1 font-mono tracking-tight w-full caret-accent text-text-hi bg-transparent {sizeClasses[size].input}"
		type="text"
		inputmode="numeric"
		{placeholder}
		value={editing ? (value ?? '') : formatted}
		oninput={onInput}
		onfocus={onFocus}
		onblur={onBlur}
		onkeydown={(e) => { if (e.key === 'Enter') inputEl.blur(); }}
	/>
</div>

<style>
	input::placeholder {
		color: var(--text-lo);
	}
</style>
