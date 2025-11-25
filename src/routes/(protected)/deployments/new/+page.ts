import { fetchNodes } from "$lib/fetch";

export async function load({ fetch }) {
    let [nodes] = await Promise.all([
        fetchNodes(fetch)
    ])

    return { nodes };
}