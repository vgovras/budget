<script lang="ts">
	import Button from '$lib/ui/button/button.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let { onAdd }: { onAdd: () => void } = $props();
</script>

<div class="bg-card-alt border border-border rounded-md px-5 py-8 flex flex-col items-center gap-2.5 relative overflow-hidden">
	<div class="absolute w-[200px] h-[140px] -top-10 left-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse,var(--accent-bg)_0%,transparent_70%)] pointer-events-none"></div>
	<div class="w-[52px] h-[52px] rounded-[18px] bg-surface-4 border border-surface-8 flex items-center justify-center">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-text-mid">
			<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
		</svg>
	</div>
	<div class="text-sm font-medium text-text-primary text-center">{m.home_no_expenses_empty_title()}</div>
	<div class="text-xs text-text-lo font-light text-center leading-relaxed max-w-[200px]">{m.home_no_expenses_empty_desc()}</div>
	<Button variant="accent" size="sm" class="mt-1 px-5 py-2.5 rounded-xl" onclick={onAdd}>+ {m.home_add_first()}</Button>
</div>
