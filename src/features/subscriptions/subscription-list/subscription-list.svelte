<script lang="ts">
	import Icon from '$lib/ui/icon/icon.svelte';
	import { subscriptionsVM } from '../subscriptions.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { fmt, locale } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onAdd, onEdit }: { onAdd: () => void; onEdit: (id: string) => void } = $props();

	const displayCurrency = $derived(
		settingsVM.fiatViewEnabled ? settingsVM.fiatCurrency : settingsVM.currency
	);

	function formatNextDate(iso: string): string {
		const d = new Date(iso);
		return d.toLocaleDateString(locale(), { day: 'numeric', month: 'short' });
	}
</script>

<div class="sub-section">
	<div class="sub-header">
		<span class="sub-title">{m.sub_section_title()}</span>
		{#if subscriptionsVM.active.length > 0}
			<span class="sub-total">{displayCurrency} {fmt(subscriptionsVM.monthlyTotal)}{m.sub_per_month()}</span>
		{/if}
	</div>

	{#each subscriptionsVM.items as sub, i (sub.id)}
		{#if i > 0}<div class="sub-divider"></div>{/if}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="sub-row" class:paused={sub.status === 'paused'} onclick={() => onEdit(sub.id)}>
			<div class="sub-icon">
				<Icon name={sub.icon} size={18} />
			</div>
			<div class="sub-info">
				<div class="sub-name">{sub.label}</div>
				<div class="sub-meta">
					{#if sub.status === 'paused'}
						{m.sub_paused()}
					{:else}
						{m.sub_next_charge()} {formatNextDate(sub.nextDate)}
					{/if}
				</div>
			</div>
			<div class="sub-amount">
				{sub.currency} {fmt(sub.amount)}
			</div>
		</div>
	{/each}

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="add-row" onclick={onAdd}>
		<div class="add-icon">
			<Icon name="plus" size={16} />
		</div>
		<span class="add-label">{m.sub_add_button()}</span>
	</div>
</div>

<style>
	.sub-section {
		background: var(--card-bg, rgba(255, 255, 255, 0.03));
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 20px;
		overflow: hidden;
		flex-shrink: 0;
	}

	.sub-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 14px 16px 8px;
	}

	.sub-title {
		font-size: 10px;
		letter-spacing: 1.3px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.22);
		font-weight: 500;
	}

	.sub-total {
		font-size: 13px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.5);
	}

	.sub-row {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.sub-row:hover {
		background: rgba(255, 255, 255, 0.03);
	}
	.sub-row.paused {
		opacity: 0.4;
	}

	.sub-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(150, 90, 255, 0.1);
		border: 1px solid rgba(150, 90, 255, 0.2);
		color: rgba(150, 90, 255, 0.7);
		flex-shrink: 0;
	}

	.sub-info {
		flex: 1;
		min-width: 0;
	}

	.sub-name {
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.85);
	}

	.sub-meta {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.25);
		font-weight: 300;
	}

	.sub-amount {
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.6);
		flex-shrink: 0;
	}

	.sub-divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.04);
		margin: 0 16px;
	}

	.add-row {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		cursor: pointer;
		transition: background 0.15s ease;
	}
	.add-row:hover {
		background: rgba(255, 255, 255, 0.03);
	}

	.add-icon {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 1px dashed rgba(255, 255, 255, 0.1);
		color: rgba(80, 130, 255, 0.6);
	}

	.add-label {
		font-size: 14px;
		color: rgba(80, 130, 255, 0.6);
		font-weight: 400;
	}
</style>
