import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { profiles } from '$lib/server/schema';
import { eq, sql } from 'drizzle-orm';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return error(401);

	const [row] = await db.select().from(profiles).where(eq(profiles.id, locals.user.id));
	if (row) return json(row);

	const [created] = await db
		.insert(profiles)
		.values({ id: locals.user.id, name: locals.user.name ?? '' })
		.returning();
	return json(created);
};

export const PATCH: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const body = await request.json();
	const [row] = await db
		.insert(profiles)
		.values({ id: locals.user.id, name: locals.user.name ?? '', ...body })
		.onConflictDoUpdate({
			target: profiles.id,
			set: { ...body, updatedAt: sql`now()` }
		})
		.returning();
	return json(row);
};
