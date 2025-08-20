import { auth } from "@/utils/auth";
import { listDeployments } from "@/utils/kubernetes";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return new Response("401 Unauthorized", {
            status: 401
        });
    }

    try {
        const deployments = await listDeployments();

        return new Response(JSON.stringify(deployments), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });

        // return new Response(JSON.stringify(rows), {
        //     status: 200,
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        // });
    } catch (err) {
        console.error("Error fetching pods:", err);
        return new Response("500 Internal Server Error", {
            status: 500
        });
    }
}