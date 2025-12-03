import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { fetchDeployment } from '$lib/fetch';

export const load: PageLoad = async ({ params, fetch }) => {
	const deployment = await fetchDeployment(params.deployment, fetch)
		.then((res) => {
			return res;
		})
		.catch((err) => {
			if (err.code === 404) {
				throw error(404, 'Deployment Not Found');
			}
			throw error(500, 'Internal Server Error ' + err);
		});
	
	return { deployment };
};