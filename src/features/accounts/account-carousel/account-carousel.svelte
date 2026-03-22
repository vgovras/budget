<script lang="ts">
	import AccountCard from '../account-card/account-card.svelte';
	import { AccountCarouselViewModel } from './account-carousel.svelte.js';
	import * as m from '$lib/paraglide/messages.js';

	let { onAddAccount }: { onAddAccount?: () => void } = $props();

	const vm = new AccountCarouselViewModel();
	let carousel: HTMLElement;
	let scrollRaf: number | null = null;
	let cardTransforms = $state<string[]>([]);
	let cardOpacities = $state<number[]>([]);
	let prevCount = 0;

	$effect(() => {
		const count = vm.accounts.length;
		if (carousel && count > 0 && count !== prevCount) {
			requestAnimationFrame(() => {
				carousel.scrollTo({
					left: vm.activeIdx * (carousel.offsetWidth + 12),
					behavior: 'instant'
				});
			});
		}
		prevCount = count;
	});

	function onScroll() {
		if (scrollRaf) return;
		scrollRaf = requestAnimationFrame(() => {
			scrollRaf = null;
			if (!carousel) return;
			const W = carousel.offsetWidth;
			const scrollX = carousel.scrollLeft;
			const total = vm.accounts.length + 1;

			const transforms: string[] = [];
			const opacities: number[] = [];
			for (let i = 0; i < total; i++) {
				transforms.push(vm.getCardTransform(i, scrollX, W));
				opacities.push(vm.getCardOpacity(i, scrollX, W));
			}
			cardTransforms = transforms;
			cardOpacities = opacities;

			const cardStep = W + 12;
			const newIdx = Math.round(scrollX / cardStep);
			if (newIdx !== vm.activeIdx && newIdx >= 0 && newIdx < vm.accounts.length) {
				vm.setActive(newIdx);
			}
		});
	}

	function scrollTo(idx: number) {
		if (carousel) vm.scrollToAccount(carousel, idx);
	}
</script>

<div class="shrink-0 relative pt-3">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="carousel"
		bind:this={carousel}
		onscroll={onScroll}
		ontouchstart={(e) => e.stopPropagation()}
		ontouchmove={(e) => e.stopPropagation()}
	>
		{#each vm.accounts as account, i (account.id)}
			<div class="carousel-item" style="transform:{cardTransforms[i] ?? 'none'};opacity:{cardOpacities[i] ?? 1}">
				<AccountCard {account} onclick={() => vm.setActive(i)} />
			</div>
		{/each}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="carousel-item snap-center snap-stop bg-card border border-dashed border-border-hi rounded-lg flex flex-col items-center justify-center gap-3 min-h-40 transition-all duration-200 cursor-pointer hover:bg-surface-4 hover:border-accent-border"
			onclick={onAddAccount}
		>
			<div class="w-12 h-12 rounded-full border border-border bg-surface-5 flex items-center justify-center text-text-lo">
				<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
					<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</div>
			<div class="text-sm text-text-lo">{m.button_add_account()}</div>
		</div>
	</div>
	<div class="flex justify-center gap-1.5 pt-2.5 pb-1">
		{#each vm.accounts as acc, i (acc.id)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="h-1.5 rounded-full transition-all duration-250 cursor-pointer
					{i === vm.activeIdx ? 'w-4.5 bg-text-primary' : 'w-1.5 bg-surface-16'}"
				onclick={() => scrollTo(i)}
			></div>
		{/each}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="w-1.5 h-1.5 rounded-full bg-surface-16 cursor-pointer" onclick={onAddAccount}></div>
	</div>
</div>

<style>
	.carousel {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 0 16px 24px;
		gap: 12px;
		perspective: 1000px;
	}
	.carousel::-webkit-scrollbar {
		display: none;
	}
	.carousel-item {
		flex-shrink: 0;
		width: calc(100vw - 48px);
		min-width: 280px;
		scroll-snap-align: center;
		scroll-snap-stop: always;
	}
</style>
