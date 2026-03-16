import type { Category, Settings, ScreenId } from './types.js';
import * as m from '$lib/paraglide/messages.js';
export type { ScreenId } from './types.js';

export const CATEGORIES: Category[] = [
	{
		icon: 'utensils',
		label: m.category_food(),
		bg: 'rgba(255,150,50,0.12)',
		border: 'rgba(255,150,50,0.25)'
	},
	{
		icon: 'car',
		label: m.category_transport(),
		bg: 'rgba(70,150,255,0.12)',
		border: 'rgba(70,150,255,0.25)'
	},
	{
		icon: 'tv',
		label: m.category_subscriptions(),
		bg: 'rgba(150,90,255,0.12)',
		border: 'rgba(150,90,255,0.25)'
	},
	{
		icon: 'gamepad',
		label: m.category_entertainment(),
		bg: 'rgba(50,195,110,0.12)',
		border: 'rgba(50,195,110,0.25)'
	},
	{
		icon: 'heart-pulse',
		label: m.category_health(),
		bg: 'rgba(255,90,120,0.12)',
		border: 'rgba(255,90,120,0.25)'
	},
	{
		icon: 'house',
		label: m.category_home(),
		bg: 'rgba(255,200,50,0.12)',
		border: 'rgba(255,200,50,0.25)'
	}
];

export const CAT_COLORS = [
	'#b57aff',
	'#40f0ff',
	'#e066ff',
	'#00c8e0',
	'#cc80ff',
	'#00a8c0',
	'#9040ff'
];

export const CAT_GLOWS = [
	'rgba(181,122,255,0.6)',
	'rgba(64,240,255,0.6)',
	'rgba(224,102,255,0.6)',
	'rgba(0,200,224,0.6)',
	'rgba(204,128,255,0.6)',
	'rgba(0,168,192,0.6)',
	'rgba(144,64,255,0.6)'
];

export const SCREEN_ORDER: ScreenId[] = ['history', 'home', 'analytics', 'settings'];

export const DEFAULT_SETTINGS: Settings = {
	budget: 0,
	salary: 0,
	payday: 1,
	currency: '₴',
	notifications: false,
	warning: true,
	catLimits: {},
	onboardingDone: false
};
