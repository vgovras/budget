<script lang="ts">
	import type { Account } from '$lib/types.js';
	import { fmt } from '$lib/utils/format.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { settingsVM } from '$features/settings/settings.svelte.js';
	import { getAccStats } from '$lib/utils/budget.js';
	import * as m from '$lib/paraglide/messages.js';

	let { account, onclick }: { account: Account; onclick?: () => void } = $props();

	const budget = $derived(settingsVM.budget);
	const spent = $derived(getAccStats(expensesVM.expenses, account.id));
	const pct = $derived(
		budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card" {onclick}>
	<div class="header">
		<span class="label">{account.label}</span>
	</div>

	<div class="amount">
		<span class="cur">{account.currencyCode}</span>{fmt(budget)}
	</div>

	{#if budget > 0}
		<div class="budget-line">
			<span class="budget-nums">{m.account_spent_of()} {account.currencyCode} {fmt(spent)} {m.account_of()} {account.currencyCode} {fmt(account.balance)}</span>
			<span class="budget-pct">{pct}%</span>
		</div>
		<div class="prog-track">
			<div class="prog-fill" style="width:{pct}%"></div>
		</div>
	{/if}
</div>

<style>
	.card {
		scroll-snap-align: center;
		scroll-snap-stop: always;
		flex-shrink: 0;
		width: 100%;
		min-width: 280px;
		box-sizing: border-box;
		overflow: hidden;
		border-radius: 24px;
		padding: 28px 24px 24px;
		position: relative;
		cursor: pointer;
		transition: transform 0.3s var(--ease-out);
		background: var(--card);
		border: 1px solid var(--border);
	}

	.card::before {
		content: '';
		position: absolute;
		top: -20px;
		left: -20px;
		width: 200px;
		height: 200px;
		background: radial-gradient(ellipse, rgba(60, 100, 220, 0.18), transparent 70%);
		pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite;
	}
	.card::after {
		content: '';
		position: absolute;
		bottom: -20px;
		right: -20px;
		width: 160px;
		height: 140px;
		background: radial-gradient(ellipse, rgba(120, 50, 180, 0.13), transparent 70%);
		pointer-events: none;
		animation: glow-pulse 4s ease-in-out infinite 2s;
	}

	.header {
		position: relative;
		z-index: 1;
		margin-bottom: 18px;
	}

	.label {
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: var(--text-lo);
	}

	.amount {
		position: relative;
		z-index: 1;
		font-size: 3.125rem;
		font-weight: 300;
		letter-spacing: -2px;
		line-height: 1;
		color: var(--text-hi);
	}

	.cur {
		font-size: 1.625rem;
		font-weight: 400;
		opacity: 0.5;
		margin-right: 3px;
		vertical-align: 10px;
	}

	.budget-line {
		position: relative;
		z-index: 1;
		display: flex;
		align-items: center;
		gap: 8px;
		margin-top: 20px;
		margin-bottom: 10px;
		font-size: 0.75rem;
		color: var(--text-lo);
		font-weight: 400;
	}
	.budget-nums {
		flex: 1;
	}
	.budget-pct {
		font-weight: 500;
		color: var(--text-secondary);
	}

	.prog-track {
		position: relative;
		z-index: 1;
		height: 3px;
		border-radius: 99px;
		background: var(--border);
		overflow: visible;
	}
	.prog-fill {
		height: 100%;
		border-radius: 99px;
		position: relative;
		transition: width 0.8s var(--ease-out);
		background: rgba(80, 130, 255, 0.7);
	}
	.prog-fill::after {
		content: '';
		position: absolute;
		right: -3px;
		top: 50%;
		transform: translateY(-50%);
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(100, 150, 255, 0.8);
		box-shadow: 0 0 6px rgba(100, 150, 255, 0.6);
	}
</style>
