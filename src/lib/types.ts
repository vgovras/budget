export interface Expense {
	id: number;
	icon: string;
	label: string;
	note: string;
	amount: number;
	day: string;
	date: string;
	accountId: string;
	type: 'expense' | 'income' | 'transfer' | 'subscription';
	commission?: number;
	netAmount?: number;
	toAccountId?: string;
	exchangeRate?: number;
	/** Original amount as entered by the user (before currency conversion) */
	displayAmount?: number;
	/** Currency the user entered the amount in */
	displayCurrency?: string;
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
	createdAt?: string;
	goalAmount?: number;
	isPrimary?: boolean;
}

export interface Settings {
	payday: number;
	currency: string;
	notifications: boolean;
	warning: boolean;
	onboardingDone: boolean;
	lastPayday: string;
	fiatViewEnabled: boolean;
	fiatCurrency: string;
	savingsPercent: number;
	theme?: 'dark' | 'light';
}

export type CategoryType = 'expense' | 'income';

export interface Category {
	id: string;
	icon: string;
	label: string;
	bg: string;
	border: string;
	type: CategoryType;
	commission?: number;
	isDefault?: boolean;
}

export interface Subscription {
	id: string;
	icon: string;
	label: string;
	amount: number;
	currency: string;
	accountId: string;
	cycle: 'monthly' | 'quarterly' | 'yearly';
	dayOfMonth: number;
	nextDate: string;
	status: 'active' | 'paused';
}

export interface RecurringTransaction {
	id: string;
	icon: string;
	label: string;
	note: string;
	amount: number;
	accountId: string;
	type: 'expense' | 'income';
	frequency: 'daily' | 'weekly' | 'monthly';
	dayOfMonth?: number;
	nextDate: string;
	enabled: boolean;
}

export type ScreenId = 'home' | 'history' | 'analytics' | 'settings';
