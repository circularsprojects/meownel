import { KubeConfig, CoreV1Api, V1Deployment, AppsV1Api } from "@kubernetes/client-node";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv)).options({
    create: { type: 'boolean', describe: 'Create a new example minecraft server' },
    selectedNode: { type: 'string', describe: 'Node to create the server on' },
    delete: { type: 'boolean', describe: 'Delete the example minecraft server' },
    namespace: { type: 'string', default: 'default', describe: 'Kubernetes namespace to use' }
}).conflicts({
    create: 'delete',
    delete: 'create'
})

async function main () {
    const argv = await parser.parse();

    const kc = new KubeConfig();
    kc.loadFromFile("k3s.yaml");

    const k8sApi = kc.makeApiClient(CoreV1Api);
    const appsApi = kc.makeApiClient(AppsV1Api)

    await k8sApi.listNode().then((res) => {
        console.log(res.items.map(node => node.metadata?.name).join(", "));
    })

    await k8sApi.listNamespacedPod({ namespace: argv.namespace }).then((res) => {
        const pods = res.items;

        for (const pod of pods) {
            console.log(`[${pod.status?.phase}] [${pod.spec?.nodeName}] ${pod.metadata?.name}`);
        }
    });

    if (argv.create) {
        if (!argv.selectedNode) {
            console.error("Please provide a node to create the server on using --selectedNode");
            return;
        }

        console.log(`Creating example minecraft server on node: ${argv.selectedNode}`);

        const deployment: V1Deployment = {
            apiVersion: "apps/v1",
            kind: "Deployment",
            metadata: { 
                name: "minecraft-server"
            },
            spec: {
                replicas: 1,
                selector: {
                    matchLabels: { app: "minecraft-server" }
                },
                template: {
                    metadata: { labels: { app: "minecraft-server" } },
                    spec: {
                        nodeSelector: { "kubernetes.io/hostname": argv.selectedNode },
                        containers: [
                            {
                                name: "minecraft",
                                image: "itzg/minecraft-server",
                                ports: [{ containerPort: 25565 }],
                                env: [
                                    { name: "EULA", value: "TRUE" },
                                    { name: "VERSION", value: "1.21.8" },
                                    { name: "TYPE", value: "PAPER" },
                                ],
                                tty: true,
                                stdin: true
                            },
                        ],
                    },
                },
            }
        }

        await appsApi.createNamespacedDeployment({
            namespace: argv.namespace,
            body: deployment
        })

        console.log("Minecraft server deployment created successfully.");

        const service = {
            apiVersion: "v1",
            kind: "Service",
            metadata: { name: "minecraft-service" },
            spec: {
                selector: { app: "minecraft" },
                ports: [{ port: 25565, targetPort: 25565 }],
                type: "NodePort"
            }
        }

        await k8sApi.createNamespacedService({
            namespace: argv.namespace,
            body: service
        })

        console.log("Minecraft server service created successfully.");
    }

    if (argv.delete) {
        console.log("Deleting example minecraft server...");

        try {
            await appsApi.deleteNamespacedDeployment({
                name: "minecraft-server",
                namespace: argv.namespace
            });
            console.log("Minecraft server deployment deleted successfully.");
        } catch (error) {
            console.error("Failed to delete deployment:", error);
        }

        try {
            await k8sApi.deleteNamespacedService({
                name: "minecraft-service",
                namespace: argv.namespace
            });
            console.log("Minecraft server service deleted successfully.");
        } catch (error) {
            console.error("Failed to delete service:", error);
        }
    }
}

main().catch((err) => {
    console.error("An error occurred:", err);
    process.exit(1);
})