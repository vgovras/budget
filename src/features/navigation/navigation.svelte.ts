import { SCREEN_ORDER, type ScreenId } from '$lib/constants.js';

export class NavigationViewModel {
	currentScreen = $state<ScreenId>('home');
	navVisible = $state(true);

	readonly currentIndex = $derived(SCREEN_ORDER.indexOf(this.currentScreen));

	goTo(id: ScreenId) {
		this.currentScreen = id;
		this.navVisible = true;
	}

	goNext() {
		const next = SCREEN_ORDER[this.currentIndex + 1];
		if (next) this.goTo(next);
	}

	goPrev() {
		const prev = SCREEN_ORDER[this.currentIndex - 1];
		if (prev) this.goTo(prev);
	}

	setNavVisible(visible: boolean) {
		this.navVisible = visible;
	}
}

export const navigationVM = new NavigationViewModel();
