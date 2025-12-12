import { auth } from "$lib/auth";
import { getPodLogs } from "$lib/kubernetes";
import { error, json, text } from "@sveltejs/kit";

export async function GET({ request, url }) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return error(401, "Unauthorized");
    }

    try {
        const podName = url.searchParams.get('podName');
        const containerName = url.searchParams.get('containerName');
        const lines = url.searchParams.get('lines');

        if (!podName) {
            return error(400, "Bad Request: Missing podName parameter");
        }

        const logs = await getPodLogs(podName, lines ? parseInt(lines) : undefined, containerName || undefined);
        return text(logs);
    } catch (err) {
        console.error("Error fetching deployment:", err);
        return json(err, {
            status: 500
        })
    }
}