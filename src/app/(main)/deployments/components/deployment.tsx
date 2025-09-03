import { toast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { V1Deployment, V1Pod } from "@kubernetes/client-node";
import { Power, Settings } from "lucide-react";

enum DeploymentState {
    Running,
    Unhealthy,
    Stopped
}

export default function Deployment({ deployment, pods }: { deployment: V1Deployment, pods: V1Pod[] }) {
    const metadata = deployment.metadata!;
    const name = metadata.name!;
    const displayName = metadata?.annotations?.displayName;
    const node = deployment.spec?.template.spec?.nodeSelector?.["kubernetes.io/hostname"];
    const replicas = deployment.spec?.replicas;

    const containers = deployment.spec?.template.spec?.containers;
    const bestImage = (() => {
        if (!containers || containers.length === 0) return null;
        if (containers.length === 1) return containers[0].image;
        for (const container of containers) {
            if (container.image?.includes("java") || container.image?.includes("minecraft")) {
                return container.image;
            }
        }
    })();

    let unhealthy = false;
    const unhealthyLogs: string[] = [];

    for (const pod of pods) {
        if (pod.status?.phase !== "Running") {
            unhealthy = true;
            for (const containerStatus of pod.status?.containerStatuses || []) {
                if (containerStatus.state?.waiting) {
                    unhealthyLogs.push(`Pod ${pod.metadata?.name} is waiting: ${containerStatus.state.waiting.reason}`);
                }
            }
        }
    }

    const state: DeploymentState = (() => {
        if (unhealthy) return DeploymentState.Unhealthy;
        if (replicas === 0) return DeploymentState.Stopped;
        return DeploymentState.Running;
    })();

    async function powerAction() {
        if (state == DeploymentState.Running || state == DeploymentState.Unhealthy) {
            toast({
                title: "Stopping deployment...",
                description: `Scaling deployment "${name}" to 0 on node "${node}"`,
            })
            const response = await fetch("/api/deployments/scale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    deployment: name,
                    scaleTarget: 0
                })
            });
            if (response.ok) {
                toast({
                    title: "Deployment stopped successfully",
                    description: `Deployment "${name}" is now stopped on node "${node}"`,
                });
            } else {
                toast({
                    title: "Error stopping deployment",
                    description: `Failed to stop deployment "${name}" on node "${node}"`,
                });
            }
        } else {
            toast({
                title: "Starting deployment...",
                description: `Scaling deployment "${name}" to 1 on node "${node}"`,
            })
            const response = await fetch("/api/deployments/scale", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    deployment: name,
                    scaleTarget: 1
                })
            });
            if (response.ok) {
                toast({
                    title: "Deployment started successfully",
                    description: `Deployment "${name}" is now running on node "${node}"`,
                });
            } else {
                toast({
                    title: "Error starting deployment",
                    description: `Failed to start deployment "${name}" on node "${node}"`,
                });
            }
        }
    }

    return (
        <div className="p-4 bg-card">
            <div className="flex flex-row items-center gap-2">
                {
                    {
                        '0': <span className="size-3 block rounded-full bg-green-500" title="Running" />,
                        '1': <span className="size-3 block rounded-full bg-yellow-500" title={unhealthyLogs.join(", ")} />,
                        '2': <span className="size-3 block rounded-full bg-red-500" title="Stopped (scaled to 0)" />,
                    }[state]
                }
                <h2 className="text-xl font-semibold">{displayName}</h2>
            </div>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Node: <span className="font-mono">{node}</span></p>
            <p className="text-muted-foreground text-sm overflow-hidden text-ellipsis whitespace-nowrap">Image: <span className="font-mono">{bestImage}</span></p>
            <div className="flex flex-row mt-2 gap-2">
                <Button variant="outline" size="sm" onClick={powerAction}><Power /> {state == DeploymentState.Running || state == DeploymentState.Unhealthy ? "Stop" : "Start"}</Button>
                <Button variant="outline" size="sm"><Settings />Manage</Button>
            </div>
        </div>
    )
}