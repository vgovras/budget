import { accountsVM } from '../accounts.svelte.js';

export class AccountCarouselViewModel {
	get accounts() {
		return accountsVM.accounts;
	}

	get activeIdx() {
		return accountsVM.activeIdx;
	}

	setActive(idx: number) {
		accountsVM.setActive(idx);
	}

	getCardTransform(idx: number, scrollLeft: number, containerWidth: number): string {
		const cardStep = containerWidth + 12;
		const center = idx * cardStep + containerWidth / 2;
		const offset = scrollLeft + containerWidth / 2 - center;
		const ratio = Math.max(-1, Math.min(1, offset / containerWidth));
		const rotY = ratio * 18;
		const scale = 1 - Math.abs(ratio) * 0.06;
		const transZ = -Math.abs(ratio) * 30;
		return `perspective(800px) rotateY(${rotY}deg) scale(${scale}) translateZ(${transZ}px)`;
	}

	getCardOpacity(idx: number, scrollLeft: number, containerWidth: number): number {
		const cardStep = containerWidth + 12;
		const center = idx * cardStep + containerWidth / 2;
		const offset = scrollLeft + containerWidth / 2 - center;
		const ratio = Math.max(-1, Math.min(1, offset / containerWidth));
		return 1 - Math.abs(ratio) * 0.25;
	}

	scrollToAccount(carousel: HTMLElement, idx: number) {
		carousel.scrollTo({ left: idx * (carousel.offsetWidth + 12), behavior: 'smooth' });
	}
}
