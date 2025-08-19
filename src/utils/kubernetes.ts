import { KubeConfig, CoreV1Api, AppsV1Api } from "@kubernetes/client-node";

const kc = new KubeConfig();
kc.loadFromFile("k3s.yaml");

export const k8sApi = kc.makeApiClient(CoreV1Api);
export const appsApi = kc.makeApiClient(AppsV1Api);

export async function listNodes() {
    try {
        return await k8sApi.listNode();
    } catch (err) {
        console.error("Error listing nodes:", err);
        throw err;
    }
}

export async function listNodesAsString(): Promise<string> {
    return await listNodes().then((res) => {
        return res.items.map(node => node.metadata?.name).join(", ");
    });
}

export const namespace = process.env.KUBERNETES_NAMESPACE || "default";

export async function listPods(searchNamespace: string = namespace) {
    try {
        return await k8sApi.listNamespacedPod({ namespace: searchNamespace });
    } catch (err) {
        console.error("Error listing pods:", err);
        throw err;
    }
}

export async function listDeployments(searchNamespace: string = namespace) {
    try {
        return await appsApi.listNamespacedDeployment({ namespace: searchNamespace });
    } catch (err) {
        console.error("Error listing deployments:", err);
        throw err;
    }
}

export async function listServices(searchNamespace: string = namespace) {
    try {
        return await k8sApi.listNamespacedService({ namespace: searchNamespace });
    } catch (err) {
        console.error("Error listing services:", err);
        throw err;
    }
}