import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { balanceAccounts } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) return error(401);

	const body = await request.json();
	const [row] = await db
		.update(balanceAccounts)
		.set(body)
		.where(and(eq(balanceAccounts.id, params.id), eq(balanceAccounts.userId, locals.user.id)))
		.returning();
	return json(row ?? null);
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) return error(401);

	await db
		.delete(balanceAccounts)
		.where(and(eq(balanceAccounts.id, params.id), eq(balanceAccounts.userId, locals.user.id)));
	return new Response(null, { status: 204 });
};
