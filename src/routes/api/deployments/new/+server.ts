import { auth } from "$lib/auth";
import { createDeployment } from "$lib/kubernetes";
import { error, json } from "@sveltejs/kit";

export async function POST({ request, params }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    const {name, displayName, image, nodeName, env, mounts}: {name: string, displayName: string, image: string, nodeName: string, env: Record<string, string>, mounts: Record<string, string>} = await request.json().catch(() => {
        return error(400, "Bad Request");
    });

    if (name == null || displayName == null || image == null || nodeName == null || env == null || mounts == null) {
        return error(400, "Bad Request");
    }

    try {
        await createDeployment({
            name,
            displayName,
            image,
            nodeName,
            env,
            mounts
        })
    } catch (error) {
        console.error("Error scaling deployment:", error);
        return json(error, {
            status: 500
        })
    }

    return json({ message: "Deployment created successfully" }, {
        status: 200
    });
}