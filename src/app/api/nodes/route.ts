import { listNodes } from "@/utils/kubernetes";

export async function GET(request: Request) {
    const nodes = await listNodes();
    const nodeNames = nodes.items.map(node => node.metadata?.name).filter(name => name !== undefined);
    return new Response(JSON.stringify(nodeNames), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function POST(request: Request) {
    return new Response(`Method ${request.method} Not Allowed`, {
        status: 405,
        headers: {
            Allow: "GET"
        }
    });
}