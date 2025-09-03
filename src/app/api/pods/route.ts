import { auth } from "@/utils/auth";
import { listPods } from "@/utils/kubernetes";
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
        const pods = await listPods();

        return new Response(JSON.stringify(pods), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error("Error fetching pods: ", err);
        return new Response(JSON.stringify(err), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}