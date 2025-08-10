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

export async function listNodesAsString() {
    await listNodes().then((res) => {
        return res.items.map(node => node.metadata?.name).join(", ");
    });
}

export async function listPods(namespace: string = process.env.KUBERNETES_NAMESPACE || "default") {
    try {
        return await k8sApi.listNamespacedPod({ namespace: namespace });
    } catch (err) {
        console.error("Error listing pods:", err);
        throw err;
    }
}
