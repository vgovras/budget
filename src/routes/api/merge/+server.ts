import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const data = await request.json();
	const userId = locals.user.id;

	// Ensure our users record exists
	await db
		.insert(schema.profiles)
		.values({ id: userId, name: locals.user.name ?? '' })
		.onConflictDoNothing({ target: schema.profiles.id });

	// Merge accounts
	if (data.accounts?.length) {
		for (const acc of data.accounts) {
			await db
				.insert(schema.balanceAccounts)
				.values({
					id: acc.id,
					userId,
					name: acc.name,
					currencyCode: acc.currency ?? acc.currencyCode,
					balance: String(acc.balance ?? 0),
					isPrimary: acc.isPrimary ?? false,
					createdAt: acc.createdAt ? new Date(acc.createdAt) : new Date()
				})
				.onConflictDoNothing({ target: schema.balanceAccounts.id });
		}
	}

	// Merge transactions
	if (data.transactions?.length) {
		for (const tx of data.transactions) {
			delete tx.id;
			if (typeof tx.createdAt === 'string') tx.createdAt = new Date(tx.createdAt);
			await db.insert(schema.transactions).values({ ...tx, userId });

			const signedAmount = tx.type === 'IN' ? tx.amount : `-${tx.amount}`;
			await db
				.update(schema.balanceAccounts)
				.set({ balance: sql`${schema.balanceAccounts.balance} + ${signedAmount}` })
				.where(eq(schema.balanceAccounts.id, tx.accountId));
		}
	}

	// Merge user JSONB — settings: local wins, arrays: union by id
	const [existing] = await db.select().from(schema.profiles).where(eq(schema.profiles.id, userId));

	const mergeArraysById = (server: any[], local: any[]) => {
		const map = new Map(server.map((item: any) => [item.id, item]));
		for (const item of local) {
			map.set(item.id, item);
		}
		return [...map.values()];
	};

	const patch: Record<string, any> = { updatedAt: sql`now()` };

	if (data.settings) {
		patch.settings = data.settings;
	}
	if (data.categories) {
		patch.categories = mergeArraysById((existing?.categories as any[]) ?? [], data.categories);
	}
	if (data.subscriptions) {
		patch.subscriptions = mergeArraysById(
			(existing?.subscriptions as any[]) ?? [],
			data.subscriptions
		);
	}
	if (data.recurring) {
		patch.recurring = mergeArraysById((existing?.recurring as any[]) ?? [], data.recurring);
	}

	await db.update(schema.profiles).set(patch).where(eq(schema.profiles.id, userId));

	return json({ ok: true });
};
