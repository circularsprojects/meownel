import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { Pool } from "pg";
import { POSTGRES_URL } from "$env/static/private";

export const auth = betterAuth({
    database: new Pool({
        connectionString: POSTGRES_URL,
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        sveltekitCookies(getRequestEvent)
    ]
});