import { auth } from "@/utils/auth";
import Pool from "@/utils/postgres";
import { KubeConfig, CoreV1Api, V1Deployment, AppsV1Api } from "@kubernetes/client-node";

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
        const result = await Pool.query("SELECT * FROM pods");
        const rows = result.rows.map(row => {
            delete row.config_path;
            return row;
        });

        return new Response(JSON.stringify(rows), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (err) {
        console.error("Error fetching pods:", err);
        return new Response("500 Internal Server Error", {
            status: 500
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