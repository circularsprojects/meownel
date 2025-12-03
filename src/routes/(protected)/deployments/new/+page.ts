import { fetchNodes } from "$lib/fetch";

export async function load({ fetch }) {
    const [nodes] = await Promise.all([
        fetchNodes(fetch)
    ])

    return { nodes };
}