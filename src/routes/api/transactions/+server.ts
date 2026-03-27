import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { transactions, balanceAccounts } from '$lib/server/schema';
import { and, desc, eq, gt, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) return error(401);

	const after = url.searchParams.get('after');
	const limit = Number(url.searchParams.get('limit')) || 100;

	const conditions = [eq(transactions.userId, locals.user.id)];
	if (after) {
		conditions.push(gt(transactions.createdAt, new Date(after)));
	}

	const rows = await db
		.select()
		.from(transactions)
		.where(and(...conditions))
		.orderBy(desc(transactions.createdAt))
		.limit(limit);

	return json(rows);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const body = await request.json();
	const items = Array.isArray(body) ? body : [body];

	for (const tx of items) {
		tx.userId = locals.user.id;
		delete tx.id;
		if (typeof tx.createdAt === 'string') tx.createdAt = new Date(tx.createdAt);

		await db.insert(transactions).values(tx);

		const signedAmount = tx.type === 'IN' ? tx.amount : `-${tx.amount}`;
		await db
			.update(balanceAccounts)
			.set({ balance: sql`${balanceAccounts.balance} + ${signedAmount}` })
			.where(eq(balanceAccounts.id, tx.accountId));
	}

	return json({ ok: true }, { status: 201 });
};
