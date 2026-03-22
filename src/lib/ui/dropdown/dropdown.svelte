<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';

	let {
		value = $bindable<string>(''),
		options,
		position = 'bottom',
		class: className = ''
	}: {
		value: string;
		options: { value: string; label: string; icon?: string }[];
		position?: 'top' | 'bottom';
		class?: string;
	} = $props();

	let open = $state(false);
	let openUp = $state(false);
	let triggerEl: HTMLElement;

	const selected = $derived(options.find((o) => o.value === value));

	function toggle() {
		if (!open && triggerEl) {
			const rect = triggerEl.getBoundingClientRect();
			openUp = rect.bottom + 250 > window.innerHeight;
		}
		open = !open;
	}

	function pick(val: string) {
		value = val;
		open = false;
	}
</script>

<div class="relative {className}">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="flex items-center justify-center gap-2 px-4 py-3 rounded-sm bg-surface-5 border border-surface-8 cursor-pointer transition-all duration-150 text-text-mid
			{open ? 'bg-surface-8' : ''}"
		bind:this={triggerEl}
		onclick={toggle}
	>
		{#if selected?.icon}
			<span class="text-lg leading-none">{selected.icon}</span>
		{/if}
		<span class="text-base text-text-hi font-medium font-sans">{selected?.label ?? value}</span>
		<span class="flex items-center transition-transform duration-200 {open ? 'rotate-180' : ''}">
			<Icon name="chevron-down" size={14} />
		</span>
	</div>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="fixed inset-0 z-10" onclick={() => (open = false)}></div>
		<div class="menu {position === 'top' || openUp ? 'menu-top' : ''}">
			{#each options as opt (opt.value)}
				<button
					class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-[10px] text-base font-sans transition-colors duration-100 active:bg-surface-5
						{value === opt.value ? 'text-text-hi font-medium' : 'text-text-mid'}"
					onclick={() => pick(opt.value)}
				>
					{#if opt.icon}
						<span class="text-lg leading-none">{opt.icon}</span>
					{/if}
					<span class="flex-1 text-left">{opt.label}</span>
					{#if value === opt.value}
						<span class="flex items-center text-text-hi"><Icon name="check" size={16} /></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.menu {
		position: absolute;
		top: calc(100% + 6px);
		right: 0;
		min-width: 180px;
		max-height: min(240px, 40vh);
		overflow-y: auto;
		overscroll-behavior: contain;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		background: rgba(22, 22, 26, 0.92);
		backdrop-filter: blur(24px) saturate(120%);
		-webkit-backdrop-filter: blur(24px) saturate(120%);
		border: 1px solid var(--border-hi);
		border-radius: 16px;
		padding: 6px;
		z-index: 11;
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.5),
			0 0 0 1px rgba(255, 255, 255, 0.04);
	}
	.menu::-webkit-scrollbar {
		display: none;
	}
	.menu-top {
		top: auto;
		bottom: calc(100% + 6px);
	}
</style>
