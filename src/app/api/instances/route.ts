import { auth } from "@/utils/auth";
import { listPods } from "@/utils/kubernetes";
import Pool from "@/utils/postgres";
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
        const runningPods = await listPods();
        const runningPodNames = runningPods.items.map(pod => pod.metadata?.labels?.app).filter(name => name !== undefined);

        const result = await Pool.query("SELECT * FROM pods");
        const rows = result.rows.map(row => {
            if (runningPodNames.includes(row.name)) {
                row.running = true;
            } else {
                row.running = false;
            }
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