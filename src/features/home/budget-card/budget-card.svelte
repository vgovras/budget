<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		spentAmount,
		totalBudget,
		spentPercent,
		daysLeft,
		monthLabel,
		currency,
		onEdit
	}: {
		spentAmount: number;
		totalBudget: number;
		spentPercent: number;
		daysLeft: number;
		monthLabel: string;
		currency: string;
		onEdit?: () => void;
	} = $props();
</script>

<div class="budget-card">
	<div class="glow-1"></div>
	<div class="glow-2"></div>

	<div class="top">
		<div>
			<div class="label">{m.home_spent_label()}</div>
			<div class="month">{monthLabel}</div>
		</div>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="edit-btn" onclick={onEdit}>{m.home_edit_button()}</div>
	</div>

	<div class="nums">
		<span class="curr">{currency}</span>
		<span class="val">{fmt(spentAmount)}</span>
		<span class="of">{m.account_of()}</span>
		<span class="total">{currency} {fmt(totalBudget)}</span>
	</div>

	<div class="prog-meta">
		<span>{currency} {fmt(spentAmount)} {m.home_spent_label().toLowerCase()}</span>
		<span>{spentPercent}% · {daysLeft} {m.home_days_short()} залишилось</span>
	</div>

	<div class="prog-track">
		<div class="prog-fill" style="width:{Math.min(spentPercent, 100)}%">
			{#if spentPercent > 0}
				<div class="prog-dot"></div>
			{/if}
		</div>
	</div>
</div>

<style>
	.budget-card {
		background: #111118;
		border-radius: 22px;
		border: 1px solid rgba(255, 255, 255, 0.07);
		padding: 18px;
		position: relative;
		overflow: hidden;
	}

	.glow-1 {
		position: absolute;
		width: 200px;
		height: 180px;
		left: -50px;
		top: -60px;
		pointer-events: none;
		background: radial-gradient(ellipse, rgba(60, 100, 220, 0.16) 0%, transparent 70%);
		animation: glow-pulse 5s ease-in-out infinite;
	}
	.glow-2 {
		position: absolute;
		width: 160px;
		height: 140px;
		right: -20px;
		bottom: -30px;
		pointer-events: none;
		background: radial-gradient(ellipse, rgba(120, 50, 200, 0.12) 0%, transparent 70%);
		animation: glow-pulse 5s ease-in-out infinite 2.5s;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 14px;
		position: relative;
	}
	.label {
		font-size: 10px;
		letter-spacing: 1.3px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.2);
		font-weight: 500;
	}
	.month {
		font-size: 11px;
		color: rgba(255, 255, 255, 0.3);
		font-weight: 300;
		margin-top: 3px;
	}
	.edit-btn {
		font-size: 11px;
		color: rgba(80, 130, 255, 0.6);
		font-weight: 400;
		cursor: pointer;
		padding: 4px 8px;
		background: rgba(80, 130, 255, 0.08);
		border: 1px solid rgba(80, 130, 255, 0.15);
		border-radius: 8px;
	}

	.nums {
		display: flex;
		align-items: baseline;
		gap: 6px;
		margin-bottom: 14px;
		position: relative;
	}
	.curr {
		font-size: 16px;
		font-weight: 300;
		opacity: 0.4;
		color: #fff;
	}
	.val {
		font-size: 28px;
		font-weight: 500;
		color: #fff;
		letter-spacing: -1px;
	}
	.of {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.3);
		font-weight: 300;
	}
	.total {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 400;
	}

	.prog-meta {
		display: flex;
		justify-content: space-between;
		font-size: 11px;
		color: rgba(255, 255, 255, 0.22);
		margin-bottom: 7px;
	}

	.prog-track {
		width: 100%;
		height: 3px;
		background: rgba(255, 255, 255, 0.07);
		border-radius: 2px;
		position: relative;
	}
	.prog-fill {
		height: 100%;
		border-radius: 2px;
		position: relative;
		background: rgba(80, 130, 255, 0.65);
		transition: width 1s ease;
	}
	.prog-dot {
		position: absolute;
		right: -4px;
		top: 50%;
		transform: translateY(-50%);
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: rgba(120, 170, 255, 0.9);
		box-shadow: 0 0 6px rgba(100, 150, 255, 0.5);
	}
</style>
