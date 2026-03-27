import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { balanceAccounts } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	if (!locals.user) return error(401);

	const body = await request.json();

	try {
		const [row] = await db
			.update(balanceAccounts)
			.set(body)
			.where(and(eq(balanceAccounts.id, params.id), eq(balanceAccounts.userId, locals.user.id)))
			.returning();
		if (row) return json(row);
	} catch {
		// Invalid UUID format or account doesn't exist — skip
	}

	return json(null);
};

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.user) return error(401);

	try {
		await db
			.delete(balanceAccounts)
			.where(and(eq(balanceAccounts.id, params.id), eq(balanceAccounts.userId, locals.user.id)));
	} catch {
		// Invalid UUID or doesn't exist
	}

	return new Response(null, { status: 204 });
};
