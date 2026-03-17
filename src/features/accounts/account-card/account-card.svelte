<script lang="ts">
	import type { Account } from '$lib/types.js';
	import { fmt } from '$lib/utils/format.js';
	import { expensesVM } from '$features/expenses/expenses.svelte.js';
	import { getAccStats } from '$lib/utils/budget.js';
	import * as m from '$lib/paraglide/messages.js';

	let { account, onclick }: { account: Account; onclick?: () => void } = $props();

	const spent = $derived(getAccStats(expensesVM.expenses, account.id));
	const pct = $derived(
		account.budget > 0 ? Math.min(Math.round((spent / account.budget) * 100), 100) : 0
	);
	const remaining = $derived(Math.max(0, account.budget - spent));
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card {account.type}" {onclick}>
	<div class="header">
		<span class="label">{account.label}</span>
	</div>

	<div class="balance">
		<span class="cur">{account.currency}</span>{fmt(remaining)}
	</div>

	<div class="sub">
		{m.account_spent_of()} <span class="hi">{account.currency} {fmt(spent)}</span>{' ' +
			m.account_of() +
			' '}{account.currency}
		{fmt(account.budget)}
	</div>

	<div class="prog-meta">
		<span>{account.currency} {fmt(spent)}</span>
		<span class="pct">{pct}%</span>
	</div>
	<div class="prog-track">
		<div class="prog-fill" style="width:{pct}%"></div>
	</div>
</div>

<style>
	.card {
		scroll-snap-align: center;
		scroll-snap-stop: always;
		flex-shrink: 0;
		width: calc(100vw - 48px);
		min-width: 280px;
		border-radius: var(--r-xl);
		padding: 28px 24px 24px;
		position: relative;
		cursor: pointer;
		transition: transform 0.3s var(--ease-out);
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(20px) saturate(120%);
		-webkit-backdrop-filter: blur(20px) saturate(120%);
		box-shadow:
			0 4px 24px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.header {
		margin-bottom: 18px;
	}

	.label {
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--text-lo);
	}

	.balance {
		font-family: var(--font-mono);
		font-size: 48px;
		font-weight: 300;
		letter-spacing: -0.03em;
		line-height: 1;
		color: var(--text-hi);
	}

	.cur {
		font-size: 18px;
		font-weight: 300;
		color: var(--text-lo);
		margin-right: 3px;
		vertical-align: 10px;
	}

	.sub {
		margin-top: 10px;
		font-size: 14px;
		font-family: var(--font-mono);
		font-weight: 300;
		color: var(--text-mid);
	}
	.sub :global(.hi) {
		color: var(--text-hi);
		font-weight: 400;
	}

	.prog-meta {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		font-family: var(--font-mono);
		color: var(--text-mid);
		margin-top: 22px;
		margin-bottom: 10px;
	}
	.pct {
		color: var(--text-hi);
		font-weight: 500;
	}

	.prog-track {
		height: 4px;
		border-radius: 99px;
		background: rgba(255, 255, 255, 0.04);
		overflow: visible;
		position: relative;
	}
	.prog-fill {
		height: 100%;
		border-radius: 99px;
		position: relative;
		transition: width 0.8s var(--ease-out);
		background: linear-gradient(90deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.6));
		box-shadow: none;
	}
	.prog-fill::after {
		content: '';
		position: absolute;
		right: -3px;
		top: 50%;
		transform: translateY(-50%);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.7);
		box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
	}
</style>
