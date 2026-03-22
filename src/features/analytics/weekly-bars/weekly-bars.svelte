<script lang="ts">
	import { getWeekDayLabels } from '$lib/utils/budget.js';

	let { weeklyAmounts }: { weeklyAmounts: number[] } = $props();

	const weekMax = $derived(Math.max(...weeklyAmounts, 1));
	const days = $derived(getWeekDayLabels());

	function barHeight(val: number): number {
		return weekMax > 0 ? Math.max(4, Math.round((val / weekMax) * 72)) : 4;
	}
</script>

<div class="flex items-end gap-1.5 h-20">
	{#each weeklyAmounts as val, i (i)}
		<div class="flex-1 flex flex-col items-center gap-1 h-full justify-end">
			<div
				class="w-full rounded-t min-h-1 transition-[height] duration-600 ease-out
					{i === 6 ? 'bg-accent-dim shadow-[0_0_8px_var(--accent-glow)]' : 'bg-accent-bg'}"
				style="height:{barHeight(val)}px"
			></div>
			<div class="text-2xs text-text-lo font-medium">{days[i]}</div>
		</div>
	{/each}
</div>
