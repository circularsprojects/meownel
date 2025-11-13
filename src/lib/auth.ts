import { getRequestEvent } from "$app/server";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { Pool } from "pg";
 
export const auth = betterAuth({
    database: new Pool({
        connectionString: "postgres://circular@localhost:5432/meownel",
    }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        sveltekitCookies(getRequestEvent)
    ]
});