import { pgTable, text, jsonb, timestamp, integer } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const userData = pgTable('user_data', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	data: jsonb('data').notNull().default('{}'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

/** Global exchange-rate cache, one row per base currency (e.g. 'usd'). */
export const exchangeRates = pgTable('exchange_rates', {
	base: text('base').primaryKey(),
	rates: jsonb('rates').notNull().$type<Record<string, number>>(),
	updateInMs: integer('update_in_ms').notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});
