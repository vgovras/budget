import { paraglideMiddleware } from '$lib/paraglide/server.js';
import { auth } from '$lib/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Better Auth — populate session from cookie
	const session = await auth.api.getSession({ headers: event.request.headers });
	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	// Better Auth handles /api/auth/* routes directly
	if (event.url.pathname.startsWith('/api/auth')) {
		return auth.handler(event.request);
	}

	// Paraglide i18n for all other routes
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => html.replace('%lang%', locale)
		});
	});
};
