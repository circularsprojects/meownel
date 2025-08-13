import { listNodesAsString, listPods, namespace } from "@/utils/kubernetes";

async function main() {
    await listNodesAsString().then((nodes) => {
        console.log("Available nodes:", nodes);
    });

    await listPods().then((pods) => {
        console.log(`Pods in ${namespace}:`);
        pods.items.forEach((pod) => {
            console.log(`[${pod.status?.phase}] [${pod.spec?.nodeName}] ${pod.metadata?.name} ${pod.metadata?.labels?.app ? `(${pod.metadata?.labels?.app})` : ''}`);
        });
    });
}

main().catch((error) => {
    console.error("Error occurred:", error);
});