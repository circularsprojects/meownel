import { listDeployments, listNodesAsString, listPods, listServices, namespace } from "$lib/kubernetes";

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

    await listDeployments().then((deployments) => {
        console.log(`Deployments in ${namespace}:`);
        deployments.items.forEach((deployment) => {
            console.log(`${deployment.metadata?.name} (${deployment.spec?.replicas} desired replicas) (${deployment.metadata?.annotations?.displayName ? deployment.metadata?.annotations?.displayName : 'No Display Name'}) (${deployment.spec?.template.spec?.containers.map(container => `${container.name}:${container.image}`).join(', ')})`);
        });
    });

    await listServices().then((services) => {
        console.log(`Services in ${namespace}:`);
        services.items.forEach((service) => {
            console.log(`${service.metadata?.name} (${service.spec?.type} ${service.spec?.ports?.map(port => `${port.port}/${port.protocol}`).join(', ')})`);
        });
    });
}

main().catch((error) => {
    console.error("Error occurred:", error);
});