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
	if (typeof body.createdAt === 'string') body.createdAt = new Date(body.createdAt);

	try {
		const [row] = await db
			.insert(balanceAccounts)
			.values({ ...body, userId: locals.user.id })
			.onConflictDoNothing({ target: balanceAccounts.id })
			.returning();
		return json(row, { status: 201 });
	} catch (e) {
		console.warn('[api/accounts] POST error:', (e as Error).message?.slice(0, 100));
		return json(null, { status: 200 });
	}
};
