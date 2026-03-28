export interface Expense {
	id: string;
	icon: string;
	label: string;
	note: string;
	amount: number;
	day: string;
	date: string;
	accountId: string;
	type: 'expense' | 'income' | 'transfer' | 'subscription';
	updatedAt: string;
	deleted?: boolean;
	commission?: number;
	netAmount?: number;
	toAccountId?: string;
	exchangeRate?: number;
	displayAmount?: number;
	displayCurrency?: string;
}

export interface Account {
	id: string;
	name: string;
	balance: number;
	currencyCode: string;
	updatedAt: string;
	deleted?: boolean;
	isPrimary?: boolean;
	createdAt?: string;
	budget?: number;
	spent?: number;
	currency?: string;
	label?: string;
	type?: string;
	goalAmount?: number;
}

export interface Settings {
	payday: number;
	currency: string;
	notifications: boolean;
	warning: boolean;
	onboardingCompletedAt: string | null;
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
	updatedAt: string;
	deleted?: boolean;
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
	updatedAt: string;
	deleted?: boolean;
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
	updatedAt: string;
	deleted?: boolean;
}

export interface UserData {
	expenses: Record<string, Expense>;
	accounts: Record<string, Account>;
	categories: Record<string, Category>;
	subscriptions: Record<string, Subscription>;
	recurring: Record<string, RecurringTransaction>;
	settings: Settings;
	syncedAt: string;
}

export type ScreenId = 'home' | 'history' | 'analytics' | 'settings';
