<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let { onAdd }: { onAdd: () => void } = $props();
</script>

<div class="empty-card">
	<div class="empty-glow"></div>
	<div class="empty-icon">
		<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
			<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
		</svg>
	</div>
	<div class="empty-title">{m.home_no_expenses_empty_title()}</div>
	<div class="empty-sub">{m.home_no_expenses_empty_desc()}</div>
	<button class="empty-add-btn" onclick={onAdd}>+ {m.home_add_first()}</button>
</div>

<style>
	.empty-card {
		background: #111118;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 20px;
		padding: 32px 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		position: relative;
		overflow: hidden;
	}

	.empty-glow {
		position: absolute;
		width: 200px;
		height: 140px;
		top: -40px;
		left: 50%;
		transform: translateX(-50%);
		background: radial-gradient(ellipse, rgba(80, 130, 255, 0.1) 0%, transparent 70%);
		pointer-events: none;
	}

	.empty-icon {
		width: 52px;
		height: 52px;
		border-radius: 18px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.08);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.empty-title {
		font-size: 14px;
		font-weight: 500;
		color: rgba(255, 255, 255, 0.65);
		text-align: center;
	}

	.empty-sub {
		font-size: 12px;
		color: rgba(255, 255, 255, 0.25);
		font-weight: 300;
		text-align: center;
		line-height: 1.5;
		max-width: 200px;
	}

	.empty-add-btn {
		margin-top: 4px;
		padding: 10px 20px;
		border-radius: 12px;
		border: 1px solid rgba(80, 130, 255, 0.2);
		cursor: pointer;
		background: rgba(80, 130, 255, 0.12);
		color: rgba(100, 160, 255, 0.85);
		font-size: 13px;
		font-weight: 500;
		font-family: var(--font);
		transition: background 0.2s;
	}
	.empty-add-btn:hover {
		background: rgba(80, 130, 255, 0.18);
	}
</style>
