import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { auth } from '$lib/auth';
import { log } from '$lib/server/logger';
import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Better Auth — populate session from cookie
	try {
		const session = await auth.api.getSession({ headers: event.request.headers });
		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	} catch (e) {
		log.warn('auth session failed', { error: (e as Error).message?.slice(0, 80) });
	}

	// API routes
	if (event.url.pathname.startsWith('/api/')) {
		const start = Date.now();
		const method = event.request.method;
		const path = event.url.pathname;
		const userId = event.locals.user?.id?.slice(0, 8) ?? 'anon';

		if (path.startsWith('/api/auth')) {
			log.info('api request', { method, path, userId });
			return auth.handler(event.request);
		}

		const response = await resolve(event);
		log.info('api request', { method, path, status: response.status, ms: Date.now() - start, userId });
		return response;
	}

	// Paraglide i18n
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		});
	});
};

export const handleError: HandleServerError = ({ error, event, status, message }) => {
	const errorId = crypto.randomUUID();
	log.error('unhandled error', {
		errorId,
		status,
		message,
		path: event.url.pathname,
		error: error instanceof Error ? error.message : String(error)
	});
	return { message: 'Internal error', errorId };
};
