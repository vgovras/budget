import { navigationVM } from '../navigation.svelte.js';
import { settingsVM } from '$features/settings/settings.svelte.js';
import type { ScreenId } from '$lib/constants.js';

export interface NavTab {
	id: ScreenId;
	icon: string;
}

export class BottomNavViewModel {
	readonly tabs: NavTab[] = [
		{ id: 'analytics', icon: 'wallet' },
		{ id: 'home', icon: 'home' },
		{ id: 'history', icon: 'list' },
		{ id: 'settings', icon: 'settings' }
	];

	tapAnimation = $state<string | null>(null);

	readonly currentScreen = $derived(navigationVM.currentScreen);
	readonly navVisible = $derived(navigationVM.navVisible && settingsVM.onboardingDone);

	goTo(id: ScreenId) {
		this.tapAnimation = id;
		navigationVM.goTo(id);
		setTimeout(() => {
			this.tapAnimation = null;
		}, 300);
	}
}
