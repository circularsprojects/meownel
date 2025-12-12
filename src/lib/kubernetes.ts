import { KubeConfig, CoreV1Api, AppsV1Api, V1Deployment, Attach } from "@kubernetes/client-node";
import { PassThrough } from "stream";
import WebSocket from "ws";
import { homedir } from "os";
import 'dotenv/config';

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

export async function attachRaw(ws: WebSocket, podName: string, containerName: string, searchNamespace: string = namespace) {
    const attach = new Attach(kc);
    
    const stdoutStream = new PassThrough();
    const stdinStream = new PassThrough();

    await attach.attach(searchNamespace, podName, containerName, stdoutStream, null, stdinStream, true).then((attachws) => {
        console.log(`Attached to pod ${podName} (container: ${containerName})`);
        ws.on('close', () => {
            attachws.close();
        })
    }).catch((err) => {
        console.error("Error attaching to pod:", err);
        throw err;
    });

    // Data received from pod, sent to client
    stdoutStream.on('data', (data) => {
        ws.send(data, { binary: true });
    });

    // Data received from client, sent to pod
    ws.on('message', (msg, isBinary) => {
        if (isBinary) stdinStream.write(msg, (error) => {
            if (error) {
                console.error("Error writing to stdin stream:", error);
            }
        });
        else stdinStream.write(Buffer.from(msg.toString(), 'utf-8'), (error) => {
            if (error) {
                console.error("Error writing to stdin stream:", error);
            }
        });
    });

    // ws.on('close', () => stdinStream.end())
}

export async function getPodLogs(podName: string, lines: number = 100, containerName: string | undefined, searchNamespace: string = namespace): Promise<string> {
    try {
        const log = await k8sApi.readNamespacedPodLog({
            name: podName,
            namespace: searchNamespace,
            container: containerName,
            pretty: "true",
            tailLines: lines
        });
        return log;
    } catch (err) {
        console.error("Error getting pod logs:", err);
        throw err;
    }
}