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

<div class="accounts-carousel-wrap">
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="accounts-carousel"
		bind:this={carousel}
		onscroll={onScroll}
		ontouchstart={(e) => e.stopPropagation()}
		ontouchmove={(e) => e.stopPropagation()}
	>
		{#each vm.accounts as account, i (account.id)}
			<div style="transform:{cardTransforms[i] ?? 'none'};opacity:{cardOpacities[i] ?? 1}">
				<AccountCard {account} onclick={() => vm.setActive(i)} />
			</div>
		{/each}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="account-card add-card" onclick={onAddAccount}>
			<div class="add-card-icon">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
					<line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
				</svg>
			</div>
			<div class="add-card-label">{m.button_add_account()}</div>
		</div>
	</div>
	<div class="carousel-dots">
		{#each vm.accounts as acc, i (acc.id)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div class="carousel-dot" class:active={i === vm.activeIdx} onclick={() => scrollTo(i)}></div>
		{/each}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="carousel-dot" onclick={onAddAccount}></div>
	</div>
</div>

<style>
	.accounts-carousel-wrap {
		flex-shrink: 0;
		position: relative;
		padding: 12px 0 0;
	}

	.accounts-carousel {
		display: flex;
		overflow-x: auto;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
		padding: 0 16px 0;
		gap: 12px;
		perspective: 1000px;
	}
	.accounts-carousel::-webkit-scrollbar {
		display: none;
	}

	.account-card.add-card {
		scroll-snap-align: center;
		scroll-snap-stop: always;
		flex-shrink: 0;
		width: calc(100vw - 48px);
		min-width: 280px;
		background: rgba(24, 24, 30, 0.9);
		border: 1px dashed rgba(255, 255, 255, 0.14);
		border-radius: var(--r-xl);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 160px;
		box-shadow: none;
		transition: all 0.2s ease;
		cursor: pointer;
	}
	.account-card.add-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(0, 220, 255, 0.25);
	}

	.add-card-icon {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--text-lo);
	}
	.add-card-icon svg {
		width: 22px;
		height: 22px;
		stroke: currentColor;
		stroke-width: 1.6;
	}
	.add-card-label {
		font-size: 14px;
		color: var(--text-lo);
		font-weight: 400;
	}

	.carousel-dots {
		display: flex;
		justify-content: center;
		gap: 6px;
		padding: 10px 0 4px;
	}

	.carousel-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.18);
		transition: all 0.25s ease;
		cursor: pointer;
	}

	.carousel-dot.active {
		background: rgba(255, 255, 255, 0.8);
		width: 18px;
		border-radius: 99px;
		box-shadow: none;
	}
</style>
