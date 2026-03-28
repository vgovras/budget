import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

export const userData = pgTable('user_data', {
	userId: text('user_id')
		.primaryKey()
		.references(() => user.id, { onDelete: 'cascade' }),
	data: jsonb('data').notNull().default('{}'),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});
