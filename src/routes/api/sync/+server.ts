import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { userData } from '$lib/server/schema';
import { mergeUserData } from '$lib/utils/merge';
import { log } from '$lib/server/logger';
import type { UserData } from '$lib/types';
import { eq } from 'drizzle-orm';

/** Read-only: does this user have saved data? */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return error(401);

	const [row] = await db
		.select()
		.from(userData)
		.where(eq(userData.userId, locals.user.id));

	const data = row?.data as UserData | undefined;
	if (!data?.settings) return json({ exists: false });

	// Ensure onboardingCompletedAt is set — if settings exist, onboarding was done
	data.settings.onboardingCompletedAt ??= new Date().toISOString();

	await db
		.update(userData)
		.set({ data, updatedAt: new Date() })
		.where(eq(userData.userId, locals.user.id));

	return json({ exists: true, data });
};

/** Merge client data with server data and persist. */
export const POST: RequestHandler = async ({ locals, request }) => {
	if (!locals.user) return error(401);

	const start = Date.now();
	const userId = locals.user.id;
	const clientData: UserData = await request.json();

	const [row] = await db.select().from(userData).where(eq(userData.userId, userId));

	const serverData: UserData = (row?.data as UserData) ?? {
		expenses: {},
		accounts: {},
		categories: {},
		subscriptions: {},
		recurring: {},
		settings: clientData.settings,
		syncedAt: ''
	};

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
		isNew: !row,
		expenses: Object.keys(merged.expenses).length,
		accounts: Object.keys(merged.accounts).length,
		ms: Date.now() - start
	});

	return json({ merged });
};
