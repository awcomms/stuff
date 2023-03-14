import { openai } from '$lib/openai';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({
	request
}) => {
	return json(
		await openai.createChatCompletion(
			await request.json()
		).then(r => {
			return r.data
		})
	)
}) satisfies RequestHandler;