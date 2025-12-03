import { auth } from "$lib/auth";
import { getDeployment } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function GET({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    try {
        const deployment = await getDeployment(params.deployment);
        return json(deployment);
    } catch (err) {
        console.error("Error fetching deployment:", err);
        return json(err, {
            status: 500
        })
    }
}