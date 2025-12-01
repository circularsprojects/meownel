<script lang="ts">
    import Deployment from "$lib/components/dashboard/deployment.svelte";
    import Node from "$lib/components/dashboard/node.svelte";
    import Toolbar from "$lib/components/toolbar.svelte";
    import type { V1Deployment, V1DeploymentList } from "@kubernetes/client-node";

    let { data } = $props();
    let { deployments, nodes }: { deployments: V1DeploymentList, nodes: string[] } = data;

    function mapDeployments(deployments: V1Deployment[]) {
        return deployments.map((deployment) => {
            const metadata = deployment.metadata!;
            const name = metadata.name!;
            const displayName = metadata?.annotations?.displayName;
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

            if (replicas && replicas > 0) {
                return {
                    name: displayName || name,
                    image: bestImage || "Unknown Image"
                };
            }
            return null;
        });
    }
</script>

<div class="flex flex-col h-dvh w-dvw">
    <Toolbar />
    <div class="w-full h-full flex items-center justify-center flex-col gap-2">
        <img src="/meownel-bubblegum.png" alt="" class="pixelated relative -z-10" width={512} height={256} />
        <div class="flex gap-2 md:flex-row flex-col w-full md:p-0 p-4 md:w-auto">
            <div class="rounded-xl border-2 border-zinc-900 p-4 bg-black md:min-w-[24rem] md:max-w-160 min-h-48">
                <h1 class="text-2xl font-bold mb-3">Active Deployments</h1>
                <div class="flex flex-col gap-2 max-h-128 overflow-y-auto">
                    {#each mapDeployments(deployments.items) as deployment}
                        {#if deployment}
                            <Deployment name={deployment?.name} image={deployment?.image} />
                        {/if}
                    {/each}
                </div>
            </div>
            <div class="rounded-xl border-2 border-zinc-900 p-4 bg-black md:min-w-[24rem] md:max-w-160 min-h-48">
                <h1 class="text-2xl font-bold mb-3">Connected Nodes</h1>
                <div class="flex flex-col gap-2 max-h-128 overflow-y-auto">
                    {#each nodes as node}
                        <Node name={node} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>