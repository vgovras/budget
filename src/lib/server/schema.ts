import { pgTable, pgEnum, text, uuid, varchar, numeric, boolean, timestamp, jsonb, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { user } from './auth-schema';

export const transactionTypeEnum = pgEnum('transaction_type', ['IN', 'OUT']);

export const profiles = pgTable('profiles', {
	id: text('id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 100 }).notNull().default(''),
	settings: jsonb('settings').notNull().default('{}'),
	categories: jsonb('categories').notNull().default('[]'),
	subscriptions: jsonb('subscriptions').notNull().default('[]'),
	recurring: jsonb('recurring').notNull().default('[]'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const balanceAccounts = pgTable('balance_accounts', {
	id: uuid('id').primaryKey().default(sql`uuidv7()`),
	userId: text('user_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	name: varchar('name', { length: 100 }).notNull(),
	currencyCode: varchar('currency_code', { length: 8 }).notNull(),
	balance: numeric('balance', { precision: 32, scale: 18 }).notNull().default('0'),
	isPrimary: boolean('is_primary').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const transactions = pgTable(
	'transactions',
	(t) => ({
		id: t.uuid('id').primaryKey().default(sql`uuidv7()`),
		userId: t
			.text('user_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		accountId: t
			.uuid('account_id')
			.notNull()
			.references(() => balanceAccounts.id, { onDelete: 'cascade' }),
		type: transactionTypeEnum('type').notNull(),
		subtype: t.varchar('subtype', { length: 64 }).notNull(),
		amount: t.numeric('amount', { precision: 32, scale: 18 }).notNull(),
		icon: t.varchar('icon', { length: 64 }).notNull().default(''),
		label: t.varchar('label', { length: 200 }).notNull().default(''),
		note: t.varchar('note', { length: 500 }).notNull().default(''),
		meta: t.jsonb('meta'),
		createdAt: t.timestamp('created_at', { withTimezone: true }).notNull()
	}),
	(table) => [check('amount_positive', sql`${table.amount} > 0`)]
);
