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

<div class="pt-5 px-1">
	<div class="text-2xs tracking-[1.4px] uppercase text-text-muted font-medium mb-1.5">{m.home_remaining_budget()}</div>
	<div class="text-[54px] font-light text-white tracking-[-3px] leading-none mb-1">
		<span class="text-2xl opacity-35 align-super tracking-normal">{currency}</span>{fmt(remaining)}
	</div>
	<div class="text-xs text-text-lo font-light flex items-center gap-1.5 mb-4.5">
		{m.account_of()} {currency} {fmt(total)} {m.home_of_budget_this_month()}
		{#if isNewMonth}
			<span class="bg-success-bg border border-success-border text-success text-2xs font-medium px-[7px] py-0.5 rounded-full tracking-[0.3px]">{m.home_new_month()}</span>
		{:else}
			<span class="bg-success-bg border border-success-border text-success text-2xs font-medium px-[7px] py-0.5 rounded-full tracking-[0.3px]">{changePercent}</span>
		{/if}
	</div>
</div>
