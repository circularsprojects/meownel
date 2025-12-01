import { fetchDeployments, fetchNodes } from "$lib/fetch";

export async function load({ fetch }) {
    const [deployments, nodes ] = await Promise.all([
        fetchDeployments(fetch),
        fetchNodes(fetch)
    ])

    return { deployments, nodes };
}