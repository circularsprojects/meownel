// import { auth } from "$lib/auth";
import 'dotenv/config';
import { betterAuth } from "better-auth";
import { Pool } from "pg";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv)).options({
    name: { type: 'string', demandOption: true, describe: 'Name for new account' },
    email: { type: 'string', demandOption: true, describe: 'Email for new account' },
    password: { type: 'string', demandOption: true, describe: 'Password for new account' }
})

const { POSTGRES_URL } = process.env;
if (!POSTGRES_URL) {
    console.error("POSTGRES_URL environment variable is not set");
    process.exit(1);
}

const auth = betterAuth({
    database: new Pool({
        connectionString: POSTGRES_URL,
    }),
    emailAndPassword: {
        enabled: true
    }
});

async function main() {
    const argv = await parser.parse();
    if (!argv.name || !argv.email || !argv.password) {
        console.error("Please provide all required fields: name, email, and password.");
        return;
    }
    await auth.api.signUpEmail({
        body: {
            name: argv.name,
            email: argv.email,
            password: argv.password
        }
    })
    .then(() => {
        console.log("Account created!");
    });
};

main().catch((error) => {
    console.error("An unexpected error occurred:");
    console.error(error);
});