import { KubeConfig, CoreV1Api, AppsV1Api, V1Deployment } from "@kubernetes/client-node";
import { homedir } from "os";

const kc = new KubeConfig();
try {
    kc.loadFromFile("kubernetes.yaml");
} catch (err) {
    console.error("Did you forget to add a 'kubernetes.yaml' file? You can make one using 'kubectl config view --raw > kubernetes.yaml' (if you're running this on the control node)");
    throw err;
}

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

export async function scaleDeployment(deploymentName: string, replicas: number, searchNamespace: string = namespace) {
    try {
        const deployment = await appsApi.readNamespacedDeployment({
            name: deploymentName,
            namespace: searchNamespace
        });

        if (deployment.spec) {
            deployment.spec!.replicas = replicas;
        } else {
            throw new Error("Deployment spec is undefined");
        }

        return await appsApi.replaceNamespacedDeployment({
            name: deploymentName,
            namespace: searchNamespace,
            body: deployment
        })
    } catch (err) {
        console.error("Error scaling deployment:", err);
        throw err;
    }
}

export async function createDeployment(
    {name, displayName, image, nodeName, env, mounts, searchNamespace = namespace}:
    {name: string, displayName: string, image: string, nodeName: string, env: Record<string, string>, mounts: Record<string, string>, searchNamespace?: string}) {    
    const deployment: V1Deployment = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: { 
            name: name,
            annotations: {
                displayName: displayName
            }
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: { app: name }
            },
            strategy: {
                rollingUpdate: {
                    maxSurge: 1,
                    maxUnavailable: 0
                }
            },
            template: {
                metadata: {
                    labels: {
                        app: name
                    }
                },
                spec: {
                    hostNetwork: true,
                    dnsPolicy: "ClusterFirstWithHostNet",
                    nodeSelector: { "kubernetes.io/hostname": nodeName },
                    containers: [
                        {
                            name: name,
                            image: image,
                            imagePullPolicy: "Always",
                            //ports: [{ containerPort: 25565 }],
                            env: Object.entries(env).map(([key, value]) => ({ name: key, value: value })),
                            tty: true,
                            stdin: true,
                            volumeMounts: Object.entries(mounts).map(([, mountPath], index) => ({
                                mountPath: mountPath,
                                name: `volume-${index}`
                            })),
                        },
                    ],
                    volumes: Object.keys(mounts).map((hostPath, index) => ({
                        name: `volume-${index}`,
                        hostPath: {
                            path: hostPath.replace(/^~(?=$|\/)/, homedir()),
                            type: "DirectoryOrCreate"
                        }
                    })),
                },
            },
        }
    }
    
    try {
        return await appsApi.createNamespacedDeployment({
            namespace: searchNamespace,
            body: deployment
        })
    } catch (err) {
        console.error("Error creating deployment:", err);
        throw err;
    }
}

export async function getDeployment(deploymentName: string, searchNamespace: string = namespace) {
    try {
        return await appsApi.readNamespacedDeployment({
            name: deploymentName,
            namespace: searchNamespace
        });
    } catch (err) {
        console.error("Error getting deployment:", err);
        throw err;
    }
}