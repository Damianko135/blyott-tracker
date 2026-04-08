import { getServerBlyottClient } from '$lib/server/blyott';
import { requireSession } from '$lib/server/session';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const session = requireSession(event);

	const client = await getServerBlyottClient();
	const accessLevelId = Number(event.url.searchParams.get('accessLevelId') ?? '1');
	const data = await client.getAccessLevel(accessLevelId);

	return json({
		userId: session.userId,
		accessLevel: data
	});
};
