<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { OnboardingViewModel } from './onboarding.svelte.js';
	import StepWelcome from './steps/step-welcome.svelte';
	import StepSalary from './steps/step-salary.svelte';
	import StepPayday from './steps/step-payday.svelte';
	import StepSavings from './steps/step-savings.svelte';
	import StepFinish from './steps/step-finish.svelte';

	const vm = new OnboardingViewModel();

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
		<div class="progress-dots">
			{#each Array(vm.totalSlides) as _, i}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<div
					class="dot"
					class:active={i === vm.currentSlide}
					class:done={i < vm.currentSlide}
					class:reachable={i <= vm.maxReachedSlide && i !== vm.currentSlide}
					onclick={() => vm.goToSlide(i)}
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
						<StepWelcome onNext={() => vm.next()} />
					{:else if vm.currentSlide === 1}
						<StepSalary bind:value={vm.salary} onNext={() => vm.next()} />
					{:else if vm.currentSlide === 2}
						<StepPayday bind:value={vm.payday} onNext={() => vm.next()} />
					{:else if vm.currentSlide === 3}
						<StepSavings
							salary={vm.salary ?? 0}
							steps={vm.savingsSteps}
							activeIdx={vm.savingsIdx}
							savingsAmount={vm.savingsAmount}
							onSelectIdx={(i) => vm.setSavingsIdx(i)}
							onCustom={(v) => vm.setCustomSavings(v)}
							onNext={() => vm.next()}
						/>
					{:else if vm.currentSlide === 4}
						<StepFinish />
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
	}

	.progress-dots {
		display: flex;
		justify-content: center;
		gap: 8px;
		padding: 20px 0 0;
		flex-shrink: 0;
	}

	.dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.15);
		transition: all 0.3s ease;
	}
	.dot.active {
		background: rgba(255, 255, 255, 0.8);
		width: 24px;
		border-radius: 99px;
	}
	.dot.done {
		background: rgba(255, 255, 255, 0.4);
	}
	.dot.reachable {
		cursor: pointer;
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
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
