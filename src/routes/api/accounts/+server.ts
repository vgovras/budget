import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { balanceAccounts } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return error(401);

	const rows = await db
		.select()
		.from(balanceAccounts)
		.where(eq(balanceAccounts.userId, locals.user.id));
	return json(rows);
};

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const body = await request.json();

	const [row] = await db
		.insert(balanceAccounts)
		.values({
			id: body.id,
			userId: locals.user.id,
			name: body.name,
			currencyCode: body.currency ?? body.currencyCode,
			balance: String(body.balance ?? 0),
			isPrimary: body.isPrimary ?? false,
			createdAt: body.createdAt ? new Date(body.createdAt) : new Date()
		})
		.onConflictDoNothing({ target: balanceAccounts.id })
		.returning();
	return json(row, { status: 201 });
};
