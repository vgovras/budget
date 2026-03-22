<script lang="ts">
	import { buildSlices, DONUT_R, DONUT_CX, DONUT_CY, DONUT_CIRC } from './donut-chart.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		byCategory,
		total,
		currency = '₴'
	}: { byCategory: { icon: string; label: string; sum: number }[]; total: number; currency?: string } = $props();

	const slices = $derived(buildSlices(byCategory, total));
	const totalLabel = $derived(total >= 1000 ? `${currency}${(total / 1000).toFixed(1)}k` : `${currency}${total}`);
</script>

<div class="flex items-center gap-4">
	<div class="shrink-0 relative w-[120px] h-[120px]">
		<svg class="donut-svg w-full h-full" viewBox="0 0 148 148" xmlns="http://www.w3.org/2000/svg">
			<circle
				cx={DONUT_CX}
				cy={DONUT_CY}
				r={DONUT_R}
				fill="none"
				stroke="rgba(255,255,255,0.05)"
				stroke-width="18"
			/>
			{#each slices as slice (slice.label)}
				<circle
					cx={DONUT_CX}
					cy={DONUT_CY}
					r={DONUT_R}
					fill="none"
					stroke={slice.color}
					stroke-width="18"
					stroke-linecap="butt"
					stroke-dasharray="{slice.dash} {DONUT_CIRC - slice.dash}"
					stroke-dashoffset={-slice.offset}
					style="transform:rotate(-90deg);transform-origin:{DONUT_CX}px {DONUT_CY}px"
				/>
			{/each}
			<text
				x={DONUT_CX}
				y="68"
				text-anchor="middle"
				font-size="10"
				fill="rgba(255,255,255,0.35)"
				font-family="DM Sans"
				letter-spacing="1">{m.analytics_donut_total()}</text
			>
			<text
				x={DONUT_CX}
				y="86"
				text-anchor="middle"
				font-size="18"
				fill="rgba(255,255,255,0.85)"
				font-family="DM Sans"
				font-weight="300"
				letter-spacing="-1">{totalLabel}</text
			>
		</svg>
	</div>

	<div class="flex-1 min-w-0 flex flex-col gap-2.5">
		{#each slices.slice(0, 5) as slice (slice.label)}
			<div class="flex items-center gap-2.5">
				<div class="w-2.5 h-2.5 rounded-full shrink-0" style="background:{slice.color}"></div>
				<div class="flex-1 min-w-0">
					<div class="flex justify-between items-center">
						<div class="text-sm text-text-mid flex-1">{slice.label}</div>
						<div class="text-sm font-mono text-text-hi font-medium">{slice.pct}%</div>
					</div>
					<div class="donut-bar" style="width:{slice.pct}%;--bar-color:{slice.color}"></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.donut-svg {
		filter: drop-shadow(0 0 6px rgba(80, 130, 255, 0.08));
	}
	.donut-bar {
		height: 2px;
		border-radius: 99px;
		margin-top: 2px;
		background: linear-gradient(90deg, var(--bar-color), transparent);
		transition: width 0.8s var(--ease-out);
	}
</style>
