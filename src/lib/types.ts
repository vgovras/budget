export interface Expense {
	id: number;
	icon: string;
	label: string;
	note: string;
	amount: number;
	day: string;
	date: string;
	accountId: string;
	type: 'expense' | 'income';
}

export interface Account {
	id: string;
	type: string;
	name: string;
	balance: number;
	budget: number;
	spent: number;
	currency: string;
	label: string;
}

export interface Settings {
	budget: number;
	salary: number;
	payday: number;
	currency: string;
	notifications: boolean;
	warning: boolean;
	catLimits: Record<string, number>;
	onboardingDone: boolean;
	lastPayday: string;
}

export interface Category {
	icon: string;
	label: string;
	bg: string;
	border: string;
}

export type ScreenId = 'home' | 'history' | 'analytics' | 'settings';
