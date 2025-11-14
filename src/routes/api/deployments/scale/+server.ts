import { auth } from "$lib/auth";
import { scaleDeployment } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function POST({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    const {deployment, scaleTarget}: {deployment: string, scaleTarget: number} = await request.json().catch(() => {
        return error(400, "Bad Request");
    });

    if (deployment == null || scaleTarget == null) {
        return error(400, "Bad Request");
    }

    try {
        await scaleDeployment(deployment, scaleTarget);
    } catch (error) {
        console.error("Error scaling deployment:", error);
        return json(error, {
            status: 500
        })
    }

    return json({ message: "Deployment scaled successfully" }, {
        status: 200
    });
}