import { locales } from '$lib/paraglide/runtime.js';

export const LANG_OPTIONS = locales.map((loc) => ({
	value: loc,
	label: loc === 'uk' ? 'Українська' : 'English',
	icon: loc === 'uk' ? '🇺🇦' : '🇬🇧'
}));
