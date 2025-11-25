import { auth } from "$lib/auth";
import { listNodes } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function GET({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    try {
        const nodes = await listNodes();
        const nodeNames = nodes.items.map(node => node.metadata?.name).filter(name => name !== undefined);
        return json(nodeNames);
    } catch (err) {
        console.error("Error fetching nodes:", err);
        return json(err, {
            status: 500
        })
    }
}