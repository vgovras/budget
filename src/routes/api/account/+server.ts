import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/auth-schema';
import { eq } from 'drizzle-orm';
import { log } from '$lib/server/logger';

/** Delete the current user — cascades to session, account and user_data. */
export const DELETE: RequestHandler = async ({ locals }) => {
	if (!locals.user) return error(401);

	await db.delete(user).where(eq(user.id, locals.user.id));
	log.info('account deleted', { userId: locals.user.id.slice(0, 8) });

	return json({ ok: true });
};
