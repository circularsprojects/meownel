import { auth } from "$lib/auth";
import { listPods } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function GET({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    try {
        const pods = await listPods();
        return json(pods);
    } catch (err) {
        console.error("Error fetching pods:", err);
        return json(err, {
            status: 500
        })
    }
}