import { env } from '$env/dynamic/private';
import { createBlyottClient } from '@blyott-tracker/blyott';

export async function getServerBlyottClient(Username?: string, Password?: string) {
	const client = createBlyottClient({
		baseUrl: env.BLYOTT_API_URL || 'https://api.blyott.com',
		token: env.BLYOTT_TOKEN
	});

	if (client.getToken()) {
		return client;
	}

	if (!env.BLYOTT_USERNAME || !env.BLYOTT_PASSWORD) {
		throw new Error('Set BLYOTT_TOKEN or BLYOTT_USERNAME/BLYOTT_PASSWORD in server env');
	}

	const loginResponse = await client.login({
		username: Username || env.BLYOTT_USERNAME, // Use provided Username or fallback to env variable
		password: Password || env.BLYOTT_PASSWORD // Use provided Password or fallback to env variable
	});

	if (!loginResponse.token) {
		throw new Error('Blyott login did not return a token');
	}

	client.setToken(loginResponse.token);
	return client;
}
