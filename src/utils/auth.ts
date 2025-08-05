import { betterAuth } from "better-auth";
import { Pool } from "pg";
 
export const auth = betterAuth({
    database: new Pool({
        connectionString: "postgres://circular@localhost:5432/meownel",
    }),
    emailAndPassword: {
        enabled: true
    }
});