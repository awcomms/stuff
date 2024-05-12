import { json } from '@sveltejs/kit';
import { groq } from '../../lib/util/groq';
import { handle_server_error } from '$lib/util/handle_server_error';
// import { RequestHandler } from './$types';

export const POST = async ({ request }) => {
	try {
		const args = await request.json();
		if (!args.model) args.model = 'mixtral-8x7b-32768';
		const res = await groq.chat.completions.create(args);
		return json(res);
	} catch (e) {
		throw handle_server_error(request, e);
	}
};