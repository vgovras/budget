import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRates } from '$lib/server/rates';

/** Public, globally-cached exchange rates (USD-based). */
export const GET: RequestHandler = async () => {
	try {
		return json(await getRates());
	} catch {
		return error(503, 'rates unavailable');
	}
};
