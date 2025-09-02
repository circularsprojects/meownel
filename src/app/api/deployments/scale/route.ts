import { auth } from "@/utils/auth";
import { scaleDeployment } from "@/utils/kubernetes";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return new Response("401 Unauthorized", {
            status: 401
        });
    }

    const {deployment, scaleTarget}: {deployment: string, scaleTarget: number} = await request.json().catch(() => {
        return new Response("400 Bad Request", {
            status: 400
        });
    });

    if (deployment == null || scaleTarget == null) {
        return new Response("400 Bad Request", {
            status: 400
        });
    }

    try {
        await scaleDeployment(deployment, scaleTarget);
    } catch (error) {
        console.error("Error scaling deployment:", error);
        return new Response("500 Internal Server Error", {
            status: 500
        });
    }

    return new Response("Deployment scaled successfully", {
        status: 200
    });
}