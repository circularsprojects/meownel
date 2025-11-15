<script lang="ts">
    import { LoaderCircle } from "lucide-svelte";
    import Node from "$lib/components/dashboard/node.svelte";
    import Deployment from "$lib/components/dashboard/deployment.svelte";
    import type { V1Deployment, V1DeploymentList } from "@kubernetes/client-node";

    let deployments = $state(fetchDeployments());
    let nodes = $state(fetchNodes());

    async function fetchDeployments() {
        const promise: Promise<V1DeploymentList> = new Promise((resolve, reject) => {
            let statusCode: number;

            fetch("/api/deployments")
                .then(res => {
                    statusCode = res.status;
                    return res.json();
                })
                .then(data => {
                    if (statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
        return promise;
    }

    async function fetchNodes() {
        const promise: Promise<string[]> = new Promise((resolve, reject) => {
            let statusCode: number;

            fetch("/api/nodes")
                .then(res => {
                    statusCode = res.status;
                    return res.json();
                })
                .then(data => {
                    if (statusCode === 200) {
                        resolve(data);
                    } else {
                        reject(data);
                    }
                })
                .catch(err => {
                    reject(err);
                });
        });
        return promise;
    }

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

<div class="flex p-2 gap-2">
    <div class="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] max-w-160 min-h-48">
        <h1 class="text-2xl font-bold mb-3">Active Deployments</h1>
        <div class="flex flex-col gap-2 max-h-128 overflow-y-auto">
            {#await deployments}
                <LoaderCircle class="animate-spin h-12 w-12 text-gray-500" />
            {:then data}
                {#each mapDeployments(data.items) as deployment}
                    <Deployment name={deployment?.name} image={deployment?.image} />
                {/each}
            {:catch error}
                <div class="bg-red-500/50 border border-red-500 p-2">
                    <p>{error}</p>
                </div>
            {/await}
        </div>
    </div>
    <div class="rounded-xl border-2 border-zinc-900 p-4 bg-black min-w-[24rem] max-w-160 min-h-48">
        <h1 class="text-2xl font-bold mb-3">Connected Nodes</h1>
        <div class="flex flex-col gap-2 max-h-128 overflow-y-auto">
            {#await nodes}
                <LoaderCircle class="animate-spin h-12 w-12 text-gray-500" />
            {:then data}
                {#each data as node}
                    <Node name={node} />
                {/each}
            {:catch error}
                <div class="bg-red-500/50 border border-red-500 p-2">
                    <p>{error}</p>
                </div>
            {/await}
        </div>
    </div>
</div>