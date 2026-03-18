<script lang="ts">
	import { buildSlices, DONUT_R, DONUT_CX, DONUT_CY, DONUT_CIRC } from './donut-chart.js';
	import * as m from '$lib/paraglide/messages.js';

	let {
		byCategory,
		total
	}: { byCategory: { icon: string; label: string; sum: number }[]; total: number } = $props();

	const slices = $derived(buildSlices(byCategory, total));
	const totalLabel = $derived(total >= 1000 ? `₴${(total / 1000).toFixed(1)}k` : `₴${total}`);
</script>

<div class="donut-wrap">
	<div class="donut-svg-wrap">
		<svg class="donut-svg" viewBox="0 0 148 148" xmlns="http://www.w3.org/2000/svg">
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

	<div class="donut-legend">
		{#each slices.slice(0, 5) as slice (slice.label)}
			<div class="donut-item">
				<div class="donut-dot" style="background:{slice.color}"></div>
				<div style="flex:1;min-width:0">
					<div style="display:flex;justify-content:space-between;align-items:center">
						<div class="donut-label">{slice.label}</div>
						<div class="donut-pct">{slice.pct}%</div>
					</div>
					<div class="donut-bar" style="width:{slice.pct}%;--bar-color:{slice.color}"></div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.donut-wrap {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.donut-svg-wrap {
		flex-shrink: 0;
		position: relative;
		width: 120px;
		height: 120px;
	}
	.donut-svg {
		width: 100%;
		height: 100%;
		filter: drop-shadow(0 0 6px rgba(80, 130, 255, 0.08));
	}
	.donut-legend {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.donut-item {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.donut-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		flex-shrink: 0;
	}
	.donut-label {
		font-size: 13px;
		color: var(--text-mid);
		flex: 1;
	}
	.donut-pct {
		font-size: 14px;
		font-family: var(--font-mono);
		color: var(--text-hi);
		font-weight: 500;
	}
	.donut-bar {
		height: 2px;
		border-radius: 99px;
		margin-top: 2px;
		background: linear-gradient(90deg, var(--bar-color), transparent);
		transition: width 0.8s var(--ease-out);
	}
</style>
