import type { RequestHandler } from '@sveltejs/kit';
import { bash } from '$lib/utils';
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export const get: RequestHandler = async (request) => {
	try {
		const dirs = await bash(`ls -d ${request.query.get('dir')}/*/`);
		return {
			body: dirs
		};
	} catch (e) {
		return {
			body: []
		};
	}
};
