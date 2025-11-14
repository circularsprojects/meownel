import { auth } from "$lib/auth";
import { listDeployments } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function GET({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    try {
        const deployments = await listDeployments();
        return json(deployments);
    } catch (err) {
        console.error("Error fetching deployments: ", err);
        return json(err, {
            status: 500
        })
    }
}