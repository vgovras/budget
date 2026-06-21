import type { Category, Settings, ScreenId, Subscription } from './types.js';
import * as m from '$lib/paraglide/messages.js';
export type { ScreenId } from './types.js';

export const DEFAULT_CATEGORIES: Category[] = [
	{
		id: 'cat-food',
		icon: 'utensils',
		label: m.category_food(),
		bg: 'rgba(240,160,70,0.12)',
		border: 'rgba(240,160,70,0.25)',
		type: 'expense',
		isDefault: true
	},
	{
		id: 'cat-transport',
		icon: 'car',
		label: m.category_transport(),
		bg: 'rgba(90,150,240,0.12)',
		border: 'rgba(90,150,240,0.25)',
		type: 'expense',
		isDefault: true
	},
	{
		id: 'cat-entertainment',
		icon: 'gamepad',
		label: m.category_entertainment(),
		bg: 'rgba(150,110,220,0.12)',
		border: 'rgba(150,110,220,0.25)',
		type: 'expense',
		isDefault: true
	},
	{
		id: 'cat-health',
		icon: 'heart-pulse',
		label: m.category_health(),
		bg: 'rgba(220,100,120,0.12)',
		border: 'rgba(220,100,120,0.25)',
		type: 'expense',
		isDefault: true
	},
	{
		id: 'cat-home',
		icon: 'house',
		label: m.category_home(),
		bg: 'rgba(220,185,70,0.12)',
		border: 'rgba(220,185,70,0.25)',
		type: 'expense',
		isDefault: true
	},
	{
		id: 'cat-salary',
		icon: 'banknote',
		label: m.settings_salary_label(),
		bg: 'rgba(70,185,130,0.12)',
		border: 'rgba(70,185,130,0.25)',
		type: 'income',
		isDefault: true
	}
];

export const CAT_COLORS = [
	'#8b8cf6',
	'#5cbcb0',
	'#d4849a',
	'#6aacdc',
	'#c49b6a',
	'#8cb89c',
	'#b488c4'
];

export const CAT_GLOWS = [
	'rgba(139,140,246,0.45)',
	'rgba(92,188,176,0.45)',
	'rgba(212,132,154,0.45)',
	'rgba(106,172,220,0.45)',
	'rgba(196,155,106,0.45)',
	'rgba(140,184,156,0.45)',
	'rgba(180,136,196,0.45)'
];

export const CAT_COLOR_PRESETS = [
	{ bg: 'rgba(240,160,70,0.12)', border: 'rgba(240,160,70,0.25)' },
	{ bg: 'rgba(90,150,240,0.12)', border: 'rgba(90,150,240,0.25)' },
	{ bg: 'rgba(150,110,220,0.12)', border: 'rgba(150,110,220,0.25)' },
	{ bg: 'rgba(70,185,130,0.12)', border: 'rgba(70,185,130,0.25)' },
	{ bg: 'rgba(220,100,120,0.12)', border: 'rgba(220,100,120,0.25)' },
	{ bg: 'rgba(220,185,70,0.12)', border: 'rgba(220,185,70,0.25)' },
	{ bg: 'rgba(70,180,190,0.12)', border: 'rgba(70,180,190,0.25)' },
	{ bg: 'rgba(200,110,170,0.12)', border: 'rgba(200,110,170,0.25)' }
];

export const CAT_ICON_PRESETS = [
	'utensils', 'car', 'tv', 'gamepad', 'heart-pulse', 'house',
	'shopping-bag', 'coffee', 'gift', 'book', 'plane', 'bus',
	'smartphone', 'music', 'dumbbell', 'baby', 'dog', 'scissors',
	'briefcase', 'graduation-cap', 'wrench', 'shirt', 'fuel', 'pill',
	'wallet', 'credit-card', 'banknote', 'landmark', 'piggy-bank',
	'target', 'bell', 'calendar', 'globe', 'sparkles',
	'home', 'list', 'bar-chart', 'settings', 'arrow-left-right'
];

// `labelKey` — для загальних (не брендових) пресетів, що локалізуються.
// Бренди (Netflix, Spotify, …) лишаються як є.
export const SUBSCRIPTION_ICON_PRESETS: { icon: string; label: string; labelKey?: string }[] = [
	{ icon: 'tv', label: 'Netflix' },
	{ icon: 'music', label: 'Spotify' },
	{ icon: 'play-circle', label: 'YouTube' },
	{ icon: 'cloud', label: 'iCloud' },
	{ icon: 'package', label: 'Amazon Prime' },
	{ icon: 'clapperboard', label: 'Disney+' },
	{ icon: 'film', label: 'HBO Max' },
	{ icon: 'github', label: 'GitHub' },
	{ icon: 'figma', label: 'Figma' },
	{ icon: 'bot', label: 'ChatGPT' },
	{ icon: 'shield', label: 'VPN' },
	{ icon: 'hard-drive', label: 'Cloud Storage', labelKey: 'sub_preset_cloud_storage' },
	{ icon: 'dumbbell', label: 'Gym', labelKey: 'sub_preset_gym' },
	{ icon: 'newspaper', label: 'News', labelKey: 'sub_preset_news' },
	{ icon: 'gamepad-2', label: 'Gaming', labelKey: 'sub_preset_gaming' },
	{ icon: 'palette', label: 'Adobe' },
	{ icon: 'file-spreadsheet', label: 'Microsoft 365' },
	{ icon: 'book-open', label: 'Notion' },
	{ icon: 'phone', label: 'Mobile', labelKey: 'sub_preset_mobile' },
	{ icon: 'wifi', label: 'Internet', labelKey: 'sub_preset_internet' },
	{ icon: 'house', label: 'Rent', labelKey: 'sub_preset_rent' },
	{ icon: 'zap', label: 'Electricity', labelKey: 'sub_preset_electricity' },
	{ icon: 'droplets', label: 'Water', labelKey: 'sub_preset_water' },
	{ icon: 'flame', label: 'Gas', labelKey: 'sub_preset_gas' },
	{ icon: 'car', label: 'Car Insurance', labelKey: 'sub_preset_car_insurance' },
	{ icon: 'stethoscope', label: 'Health Insurance', labelKey: 'sub_preset_health_insurance' },
	{ icon: 'monitor', label: 'Apple TV' },
	{ icon: 'headphones', label: 'Apple Music' },
	{ icon: 'mail', label: 'Email', labelKey: 'sub_preset_email' },
	{ icon: 'message-circle', label: 'Messenger' },
	{ icon: 'map-pin', label: 'Maps', labelKey: 'sub_preset_maps' },
	{ icon: 'podcast', label: 'Podcast', labelKey: 'sub_preset_podcast' },
	{ icon: 'key', label: 'Password Manager', labelKey: 'sub_preset_password_manager' },
	{ icon: 'brush', label: 'Canva' },
	{ icon: 'infinity', label: 'Other', labelKey: 'sub_preset_other' },
];

export const CURRENCIES = ['₴', '$', '€', '£', 'zł'] as const;

export const CURRENCY_CODES: Record<string, string> = {
	'₴': 'UAH',
	'$': 'USD',
	'€': 'EUR',
	'£': 'GBP',
	'zł': 'PLN'
};

export const CURRENCY_LABELS: Record<string, string> = {
	'₴': '₴ UAH',
	'$': '$ USD',
	'€': '€ EUR',
	'£': '£ GBP',
	'zł': 'zł PLN'
};

export const SCREEN_ORDER: ScreenId[] = ['analytics', 'home', 'history', 'settings'];

export const DEFAULT_SETTINGS: Settings = {
	payday: 1,
	currency: '₴',
	notifications: false,
	warning: true,
	onboardingCompletedAt: null,
	lastPayday: '',
	fiatViewEnabled: false,
	fiatCurrency: '₴',
	savingsPercent: 0,
	updatedAt: ''
};
