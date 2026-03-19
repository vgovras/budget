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

<div class="dropdown {className}">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="trigger" class:open bind:this={triggerEl} onclick={toggle}>
		{#if selected?.icon}
			<span class="trigger-icon">{selected.icon}</span>
		{/if}
		<span class="trigger-label">{selected?.label ?? value}</span>
		<span class="trigger-chevron" class:flipped={open}>
			<Icon name="chevron-down" size={14} />
		</span>
	</div>

	{#if open}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="backdrop" onclick={() => (open = false)}></div>
		<div class="menu" class:menu-top={position === 'top' || openUp}>
			{#each options as opt (opt.value)}
				<button class="option" class:active={value === opt.value} onclick={() => pick(opt.value)}>
					{#if opt.icon}
						<span class="option-icon">{opt.icon}</span>
					{/if}
					<span class="option-label">{opt.label}</span>
					{#if value === opt.value}
						<span class="option-check"><Icon name="check" size={16} /></span>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
	}

	.trigger {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 10px 16px;
		border-radius: 14px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.08);
		cursor: pointer;
		transition: all 0.15s ease;
		color: var(--text-mid);
	}
	.trigger:active,
	.trigger.open {
		background: rgba(255, 255, 255, 0.08);
	}

	.trigger-icon {
		font-size: 18px;
		line-height: 1;
	}
	.trigger-label {
		color: var(--text-hi);
		font-size: 15px;
		font-weight: 500;
		font-family: var(--font);
	}
	.trigger-chevron {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}
	.trigger-chevron.flipped {
		transform: rotate(180deg);
	}

	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 10;
	}

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
		border: 1px solid rgba(255, 255, 255, 0.1);
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

	.option {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 10px 12px;
		border: none;
		background: none;
		border-radius: 10px;
		color: var(--text-mid);
		font-family: var(--font);
		font-size: 15px;
		font-weight: 400;
		cursor: pointer;
		transition: background 0.12s ease;
	}
	.option:active {
		background: rgba(255, 255, 255, 0.06);
	}
	.option.active {
		color: var(--text-hi);
		font-weight: 500;
	}

	.option-icon {
		font-size: 18px;
		line-height: 1;
	}
	.option-label {
		flex: 1;
		text-align: left;
	}
	.option-check {
		display: flex;
		align-items: center;
		color: var(--text-hi);
	}
</style>
