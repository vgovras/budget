import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userData } from '$lib/server/schema';
import { mergeUserData } from '$lib/utils/merge';
import { log } from '$lib/server/logger';
import type { UserData } from '$lib/types';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const start = Date.now();
	const clientData: UserData = await request.json();
	const userId = locals.user.id;

	const [row] = await db.select().from(userData).where(eq(userData.userId, userId));
	const isNew = !row;

	const serverData = (row?.data ?? {
		expenses: {},
		accounts: {},
		categories: {},
		subscriptions: {},
		recurring: {},
		settings: clientData.settings,
		syncedAt: ''
	}) as UserData;

	const merged = mergeUserData(serverData, clientData);

	await db
		.insert(userData)
		.values({ userId, data: merged, updatedAt: new Date() })
		.onConflictDoUpdate({
			target: userData.userId,
			set: { data: merged, updatedAt: new Date() }
		});

	log.info('sync complete', {
		userId: userId.slice(0, 8),
		isNew,
		expenses: Object.keys(merged.expenses).length,
		accounts: Object.keys(merged.accounts).length,
		ms: Date.now() - start
	});

	return json({ merged });
};
