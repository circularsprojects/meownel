import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { Pool } from "pg";

const connectionString = process.env.POSTGRES_URL;
if (!connectionString) {
    throw new Error("POSTGRES_URL environment variable is not set");
}

export const auth = betterAuth({
    database: new Pool({
        connectionString: connectionString,
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        sveltekitCookies(getRequestEvent)
    ]
});