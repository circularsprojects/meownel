<script lang="ts">
    import { Power, Settings } from 'lucide-svelte';
    import { toast } from 'svelte-sonner';
    import { Tooltip } from 'bits-ui';
    import type { V1Pod, V1Deployment } from "@kubernetes/client-node";

    const DeploymentState = {
        Running: 1,
        Unhealthy: 2,
        Stopped: 3
    }

    let { deployment, pods }: { deployment: V1Deployment; pods: V1Pod[] } = $props();

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

    const state: number = (() => {
        if (unhealthy) return DeploymentState.Unhealthy;
        if (replicas === 0) return DeploymentState.Stopped;
        return DeploymentState.Running;
    })();

    async function onclick() {
        if (state == DeploymentState.Running || state == DeploymentState.Unhealthy) {
            const stopToast = toast.loading("Stopping deployment...");
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
                toast.success("Deployment stopped successfully!", {
                    id: stopToast
                });
            } else {
                toast.error(`Failed to stop deployment "${name}" on node "${node}"`, {
                    id: stopToast
                });
            }
        } else {
            const startToast = toast.loading("Starting deployment...");
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
                toast.success("Deployment started successfully!", {
                    id: startToast
                });
            } else {
                toast.error(`Failed to start deployment "${name}" on node "${node}"`, {
                    id: startToast
                });
            }
        }
    }
</script>

<div class="p-4 bg-zinc-900 rounded-xl">
    <div class="flex flex-row items-center gap-2">
        <Tooltip.Provider>
            <Tooltip.Root delayDuration={100}>
                <Tooltip.Trigger>
                    {#if state == DeploymentState.Running}
                        <span class="size-3 block rounded-full bg-green-500"></span>
                    {:else if state == DeploymentState.Unhealthy}
                        <span class="size-3 block rounded-full bg-yellow-500"></span>
                    {:else}
                        <span class="size-3 block rounded-full bg-red-500"></span>
                    {/if}
                </Tooltip.Trigger>
                <Tooltip.Content
                    sideOffset={8}
                    class="animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--bits-tooltip-content-transform-origin)"
                >
                <div
                    class="rounded-lg bg-background shadow-popover outline-hidden z-0 flex items-center justify-center border border-border p-2 text-sm font-medium"
                >
                    {#if state == DeploymentState.Running}
                        Running
                    {:else if state == DeploymentState.Unhealthy}
                        {unhealthyLogs.join(", ")}
                    {:else}
                        Stopped (scaled to 0)
                    {/if}
                </div>
                </Tooltip.Content>
            </Tooltip.Root>
        </Tooltip.Provider>
        <h2 class="text-xl font-semibold">{displayName || name}</h2>
    </div>
    <p class="text-sm overflow-hidden text-ellipsis whitespace-nowrap">Node: <span class="font-mono">{node}</span></p>
    <p class="text-sm overflow-hidden text-ellipsis whitespace-nowrap">Image: <span class="font-mono">{bestImage || "Unknown Image"}</span></p>
    <div class="flex flex-row mt-2 gap-2">
        <button class="border border-zinc-600 hover:border-zinc-400 flex flex-row items-center gap-2 px-2 py-1 rounded-md cursor-pointer active:scale-95 transition" {onclick}>
            <Power class="size-5" />
            {#if state == DeploymentState.Running || state == DeploymentState.Unhealthy}
                Stop
            {:else}
                Start
            {/if}
        </button>
        <button class="border border-zinc-600 hover:border-zinc-400 flex flex-row items-center gap-2 px-2 py-1 rounded-md cursor-pointer active:scale-95 transition">
            <Settings class="size-5" />
            Manage
        </button>
    </div>
</div>