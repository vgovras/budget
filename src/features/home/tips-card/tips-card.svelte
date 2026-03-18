<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="tips-card">
	<div class="tips-inner">
		<div class="tip-dot"></div>
		<div>
			<div class="tip-label">{m.home_tip_title()}</div>
			<div class="tip-text">{m.home_tip_text()}</div>
		</div>
	</div>
</div>

<style>
	.tips-card {
		background: #111118;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		overflow: hidden;
	}

	.tips-inner {
		padding: 14px 16px;
		display: flex;
		gap: 12px;
		align-items: flex-start;
	}

	.tip-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(80, 130, 255, 0.6);
		flex-shrink: 0;
		margin-top: 3px;
	}

	.tip-label {
		font-size: 9px;
		letter-spacing: 1.2px;
		text-transform: uppercase;
		color: rgba(80, 130, 255, 0.6);
		font-weight: 500;
		margin-bottom: 4px;
	}

	.tip-text {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.5);
		font-weight: 300;
		line-height: 1.5;
	}
</style>
