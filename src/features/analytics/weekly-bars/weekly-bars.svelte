<script lang="ts">
	let { weeklyAmounts }: { weeklyAmounts: number[] } = $props();

	const weekMax = $derived(Math.max(...weeklyAmounts, 1));

	const days = $derived(
		Array.from({ length: 7 }, (_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - (6 - i));
			return d.toLocaleDateString('uk-UA', { weekday: 'short' }).slice(0, 2);
		})
	);

	function barHeight(val: number): number {
		return weekMax > 0 ? Math.max(4, Math.round((val / weekMax) * 72)) : 4;
	}
</script>

<div class="weekly-bars">
	{#each weeklyAmounts as val, i}
		<div class="week-bar-wrap">
			<div
				class="week-bar"
				class:current={i === 6}
				style="height:{barHeight(val)}px"
			></div>
			<div class="week-label">{days[i]}</div>
		</div>
	{/each}
</div>

<style>
	.weekly-bars {
		display: flex;
		align-items: flex-end;
		gap: 6px;
		height: 80px;
	}
	.week-bar-wrap {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		height: 100%;
		justify-content: flex-end;
	}
	.week-bar {
		width: 100%;
		border-radius: 4px 4px 0 0;
		background: rgba(255, 255, 255, 0.12);
		min-height: 4px;
		transition: height 0.6s var(--ease-out);
	}
	.week-bar.current {
		background: rgba(255, 255, 255, 0.30);
		box-shadow: none;
	}
	.week-label {
		font-size: 10px;
		color: var(--text-lo);
		font-weight: 500;
	}
</style>
