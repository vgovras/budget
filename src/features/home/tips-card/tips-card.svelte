<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="bg-card-alt border border-border rounded-md overflow-hidden">
	<div class="px-4 py-3.5 flex gap-3 items-start">
		<div class="w-1.5 h-1.5 rounded-full bg-accent-dim shrink-0 mt-[3px]"></div>
		<div>
			<div class="text-2xs tracking-[1.2px] uppercase text-accent-dim font-medium mb-1">{m.home_tip_title()}</div>
			<div class="text-xs text-text-secondary font-light leading-relaxed">{m.home_tip_text()}</div>
		</div>
	</div>
</div>
