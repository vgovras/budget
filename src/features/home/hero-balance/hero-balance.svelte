<script lang="ts">
	import { fmt } from '$lib/utils/format.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		remaining,
		total,
		currency,
		changePercent,
		isNewMonth,
		monthLabel
	}: {
		remaining: number;
		total: number;
		currency: string;
		changePercent: string;
		isNewMonth: boolean;
		monthLabel: string;
	} = $props();
</script>

<div class="hero">
	<div class="hero-label">{m.home_remaining_budget()}</div>
	<div class="hero-balance">
		<span class="curr">{currency}</span>{fmt(remaining)}
	</div>
	<div class="hero-sub">
		{m.account_of()} {currency} {fmt(total)} {m.home_of_budget_this_month()}
		{#if isNewMonth}
			<span class="chip new">{m.home_new_month()}</span>
		{:else}
			<span class="chip">{changePercent}</span>
		{/if}
	</div>
</div>

<style>
	.hero {
		padding: 20px 4px 0;
	}

	.hero-label {
		font-size: 10px;
		letter-spacing: 1.4px;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.22);
		font-weight: 500;
		margin-bottom: 6px;
	}

	.hero-balance {
		font-size: 54px;
		font-weight: 300;
		color: #fff;
		letter-spacing: -3px;
		line-height: 1;
		margin-bottom: 5px;
	}
	.hero-balance .curr {
		font-size: 26px;
		opacity: 0.35;
		vertical-align: super;
		letter-spacing: 0;
	}

	.hero-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.25);
		font-weight: 300;
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 18px;
	}

	.chip {
		background: rgba(80, 200, 120, 0.12);
		border: 1px solid rgba(80, 200, 120, 0.2);
		color: rgba(80, 200, 120, 0.85);
		font-size: 10px;
		font-weight: 500;
		padding: 2px 7px;
		border-radius: 20px;
		letter-spacing: 0.3px;
	}

	.chip.new {
		background: rgba(80, 200, 120, 0.1);
		border: 1px solid rgba(80, 200, 120, 0.18);
	}
</style>
