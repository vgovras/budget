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
	savingsPercent?: number;
	goalAmount?: number;
	goalDeadline?: string;
}

export interface Settings {
	budget: number;
	salary: number;
	payday: number;
	currency: string;
	notifications: boolean;
	warning: boolean;
	onboardingDone: boolean;
	lastPayday: string;
	fiatViewEnabled: boolean;
	fiatCurrency: string;
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
