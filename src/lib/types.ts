export interface Expense {
	id: number;
	icon: string;
	label: string;
	note: string;
	amount: number;
	day: string;
	date: string;
	accountId: string;
	type: 'expense' | 'income' | 'transfer';
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

export interface Category {
	id: string;
	icon: string;
	label: string;
	bg: string;
	border: string;
	commission?: number;
	isDefault?: boolean;
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
	nextDate: string;
	enabled: boolean;
}

export type ScreenId = 'home' | 'history' | 'analytics' | 'settings';
