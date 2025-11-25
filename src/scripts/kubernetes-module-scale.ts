import { scaleDeployment } from "$lib/kubernetes";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv)).options({
    deployment: { type: 'string', describe: 'Deployment name to scale', demandOption: true },
    replicas: { type: 'number', describe: 'Number of replicas to scale to', demandOption: true }
})

async function main() {
    const argv = await parser.parse();

    await scaleDeployment(argv.deployment, argv.replicas).then(() => {
        console.log(`Scaled deployment ${argv.deployment} to ${argv.replicas} replicas.`);
    })
}

main().catch((error) => {
    console.error("Error occurred:", error);
});