import { auth } from "@/utils/auth";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv)).options({
    name: { type: 'string', demandOption: true, describe: 'Name for new account' },
    email: { type: 'string', demandOption: true, describe: 'Email for new account' },
    password: { type: 'string', demandOption: true, describe: 'Password for new account' }
})

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