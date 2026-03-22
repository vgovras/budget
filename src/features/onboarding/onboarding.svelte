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
		class="fixed inset-0 z-50 bg-bg flex flex-col max-w-[600px] mx-auto"
		transition:fade={{ duration: 400 }}
		ontouchstart={onTouchStart}
		ontouchmove={onTouchMove}
		ontouchend={onTouchEnd}
	>
		<div class="flex gap-[5px] px-6 pt-3.5 shrink-0">
			{#each segments as i (i)}
				<div
					class="flex-1 h-0.5 rounded-[1px] transition-colors duration-400
						{i < vm.currentSlide ? 'bg-[rgba(255,255,255,0.7)]' : i === vm.currentSlide ? 'bg-text-mid' : 'bg-surface-10'}"
				></div>
			{/each}
		</div>

		<div class="flex-1 grid place-items-center overflow-hidden relative">
			{#key vm.currentSlide}
				<div
					class="absolute inset-0"
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
