<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { OnboardingViewModel } from './onboarding.svelte.js';
	import StepIntro from './steps/step-intro.svelte';
	import StepSalary from './steps/step-salary.svelte';
	import StepPayday from './steps/step-payday.svelte';
	import StepSavings from './steps/step-savings.svelte';
	import StepReady from './steps/step-ready.svelte';

	const vm = new OnboardingViewModel();
	const segments = $derived(Array.from({ length: vm.totalSlides }, (_, i) => i));

	let startX = 0;
	let startY = 0;
	let axis: 'h' | 'v' | null = null;
	const LOCK = 10;
	const SWIPE = 60;

	function onTouchStart(e: TouchEvent) {
		const t = e.touches[0];
		startX = t.clientX;
		startY = t.clientY;
		axis = null;
	}

	function onTouchMove(e: TouchEvent) {
		if (axis === 'v') return;
		const t = e.touches[0];
		const dx = t.clientX - startX;
		const dy = t.clientY - startY;
		if (!axis) {
			if (Math.abs(dx) < LOCK && Math.abs(dy) < LOCK) return;
			axis = Math.abs(dx) >= Math.abs(dy) ? 'h' : 'v';
		}
	}

	function onTouchEnd(e: TouchEvent) {
		if (axis !== 'h') return;
		const t = e.changedTouches[0];
		const dx = t.clientX - startX;
		if (dx < -SWIPE && vm.canGoForward) {
			vm.goToSlide(vm.currentSlide + 1);
		} else if (dx > SWIPE && vm.canGoBack) {
			vm.prev();
		}
	}
</script>

{#if vm.visible}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="onboarding"
		transition:fade={{ duration: 400 }}
		ontouchstart={onTouchStart}
		ontouchmove={onTouchMove}
		ontouchend={onTouchEnd}
	>
		<div class="progress-bar">
			{#each segments as i (i)}
				<div
					class="seg"
					class:done={i < vm.currentSlide}
					class:active={i === vm.currentSlide}
				></div>
			{/each}
		</div>

		<div class="slides">
			{#key vm.currentSlide}
				<div
					class="slide-wrap"
					in:fly={{ x: vm.direction * 80, duration: 350, delay: 150 }}
					out:fly={{ x: vm.direction * -80, duration: 250 }}
				>
					{#if vm.currentSlide === 0}
						<StepIntro onNext={() => vm.next()} />
					{:else if vm.currentSlide === 1}
						<StepSalary bind:value={vm.salary} bind:currency={vm.currency} bind:fiatViewEnabled={vm.fiatViewEnabled} bind:fiatCurrency={vm.fiatCurrency} onNext={() => vm.next()} />
					{:else if vm.currentSlide === 2}
						<StepPayday bind:value={vm.payday} onNext={() => vm.next()} />
					{:else if vm.currentSlide === 3}
						<StepSavings
							salary={vm.salary ?? 0}
							currency={vm.currency}
							fiatViewEnabled={vm.fiatViewEnabled}
							fiatCurrency={vm.fiatCurrency}
							savingsPercent={vm.savingsPercent}
							savingsAmount={vm.savingsAmount}
							budget={vm.budget}
							onSetPercent={(pct) => vm.setSavingsPercent(pct)}
							onNext={() => vm.next()}
						/>
					{:else if vm.currentSlide === 4}
						<StepReady budget={vm.budget > 0 ? vm.budget : 10000} currency={vm.currency} onFinish={() => vm.finish()} onBack={() => vm.prev()} />
					{/if}
				</div>
			{/key}
		</div>
	</div>
{/if}

<style>
	.onboarding {
		position: fixed;
		inset: 0;
		z-index: 50;
		background: var(--bg);
		display: flex;
		flex-direction: column;
		max-width: 600px;
		margin: 0 auto;
	}

	.progress-bar {
		display: flex;
		gap: 5px;
		padding: 14px 24px 0;
		flex-shrink: 0;
	}

	.seg {
		flex: 1;
		height: 2px;
		border-radius: 1px;
		background: rgba(255, 255, 255, 0.1);
		transition: background 0.4s ease;
	}
	.seg.done {
		background: rgba(255, 255, 255, 0.7);
	}
	.seg.active {
		background: rgba(255, 255, 255, 0.45);
	}

	.slides {
		flex: 1;
		display: grid;
		place-items: center;
		overflow: hidden;
		position: relative;
	}

	.slide-wrap {
		position: absolute;
		inset: 0;
	}
</style>
