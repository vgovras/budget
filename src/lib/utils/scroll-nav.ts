import { navigationVM } from '$features/navigation/navigation.svelte.js';

const THRESHOLD = 8;

export function scrollNav(node: HTMLElement) {
	let lastY = node.scrollTop;

	function onScroll() {
		const y = node.scrollTop;
		const dy = y - lastY;

		if (dy > THRESHOLD) {
			navigationVM.setNavVisible(false);
		} else if (dy < -THRESHOLD) {
			navigationVM.setNavVisible(true);
		}

		lastY = y;
	}

	node.addEventListener('scroll', onScroll, { passive: true });

	return {
		destroy() {
			node.removeEventListener('scroll', onScroll);
		}
	};
}
