<script lang="ts">
	import { navigationVM } from '../navigation.svelte.js';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let startX = 0;
	let startY = 0;
	let dragPx = $state(0);
	let dragging = $state(false);
	let axis: 'h' | 'v' | null = null;
	let trackWidth = 0;
	let trackEl: HTMLElement;
	let ignored = false;

	const LOCK_THRESHOLD = 10;
	const SWIPE_THRESHOLD = 0.2;

	function isScrollableX(el: EventTarget | null): boolean {
		let node = el as HTMLElement | null;
		while (node && node !== trackEl) {
			if (node.scrollWidth > node.clientWidth + 1) return true;
			node = node.parentElement;
		}
		return false;
	}

	const translateX = $derived(() => {
		const base = -navigationVM.currentIndex * 100;
		if (!dragging || !trackWidth) return base;
		return base + (dragPx / trackWidth) * 100;
	});

	function onTouchStart(e: TouchEvent) {
		ignored = isScrollableX(e.target);
		const t = e.touches[0];
		startX = t.clientX;
		startY = t.clientY;
		dragPx = 0;
		axis = null;
		dragging = false;
		trackWidth = trackEl?.offsetWidth ?? 1;
	}

	function onTouchMove(e: TouchEvent) {
		if (ignored) return;
		const t = e.touches[0];
		const dx = t.clientX - startX;
		const dy = t.clientY - startY;

		if (!axis) {
			if (Math.abs(dx) < LOCK_THRESHOLD && Math.abs(dy) < LOCK_THRESHOLD) return;
			axis = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
		}

		if (axis === 'v') return;

		e.preventDefault();
		dragging = true;

		// Rubber-band at edges
		const idx = navigationVM.currentIndex;
		if ((idx === 0 && dx > 0) || (idx === 3 && dx < 0)) {
			dragPx = dx * 0.3;
		} else {
			dragPx = dx;
		}
	}

	function onTouchEnd() {
		if (!dragging || axis !== 'h') {
			dragging = false;
			dragPx = 0;
			axis = null;
			return;
		}

		const ratio = dragPx / trackWidth;

		if (ratio < -SWIPE_THRESHOLD) {
			navigationVM.goNext();
		} else if (ratio > SWIPE_THRESHOLD) {
			navigationVM.goPrev();
		}

		dragging = false;
		dragPx = 0;
		axis = null;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="screen-track"
	class:no-transition={dragging}
	bind:this={trackEl}
	style="transform:translateX({translateX()}%)"
	ontouchstart={onTouchStart}
	ontouchmove={onTouchMove}
	ontouchend={onTouchEnd}
>
	{@render children()}
</div>

<style>
	.screen-track {
		display: flex;
		width: 100%;
		flex: 1;
		min-height: 0;
		touch-action: pan-y;
		transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
		will-change: transform;
	}
	.screen-track.no-transition {
		transition: none;
	}
</style>
