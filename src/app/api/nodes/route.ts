import { auth } from "@/utils/auth";
import { listNodes } from "@/utils/kubernetes";

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers
    });
    if (!session) {
        return new Response("401 Unauthorized", {
            status: 401
        });
    }

    try {
        const nodes = await listNodes();
        const nodeNames = nodes.items.map(node => node.metadata?.name).filter(name => name !== undefined);
        return new Response(JSON.stringify(nodeNames), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error("Error fetching nodes:", err);
        return new Response(JSON.stringify(err), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}

export async function POST(request: Request) {
    return new Response(`Method ${request.method} Not Allowed`, {
        status: 405,
        headers: {
            Allow: "GET"
        }
    });
}