import { error, type RequestEvent } from '@sveltejs/kit';
import type { Session } from 'better-auth/minimal';

export function getSession(event: RequestEvent): Session | undefined {
	return event.locals.session;
}

export function requireSession(event: RequestEvent): Session {
	const session = event.locals.session;
	if (!session) {
		throw error(401, 'Unauthorized');
	}
	return session;
}
