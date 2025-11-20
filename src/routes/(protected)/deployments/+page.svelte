<script lang="ts">
    import Toolbar from "$lib/components/toolbar.svelte";
    import Dropdown from "$lib/components/dropdown.svelte";
    import Deployment from "$lib/components/deployments/deployment.svelte";
    import { Plus, LoaderCircle } from 'lucide-svelte';
    import type { V1Deployment, V1DeploymentList, V1PodList, V1NodeList } from "@kubernetes/client-node";
    import { onMount } from 'svelte';
    import { fetchDeployments, fetchPods, fetchNodes } from "$lib/fetch";

    let filter = $state("");
    let nodeFilter = $state("");

    // let both = $state(fetchBoth());
    // let nodes = $state(fetchNodes());

    // async function fetchBoth() {
    //     const promise: Promise<{ deployments: V1DeploymentList; pods: V1PodList }> = new Promise(async (resolve, reject) => {
    //         try {
    //             const deployments = await fetchDeployments();
    //             const pods = await fetchPods();
    //             resolve({ deployments, pods });
    //         } catch (error) {
    //             reject(error);
    //         }
    //     });
    //     return promise;
    // }
    let { data } = $props();
    let { deployments, pods, nodes }: { deployments: V1DeploymentList, pods: V1PodList, nodes: string[] } = data;

    function mapDeployments(deployments: V1Deployment[], pods: V1PodList) {
        return deployments.map((deployment) => {
            const metadata = deployment.metadata!;
            const name = metadata.name!;
            const displayName = metadata?.annotations?.displayName;
            const node = deployment.spec?.template.spec?.nodeSelector?.["kubernetes.io/hostname"];
            const associatedPods = pods ? pods.items.filter(pod => {
                const podSelector = pod.metadata?.labels?.app;
                return podSelector === name;
            }) : [];

            if ((displayName?.toLowerCase().includes(filter.toLowerCase()) || name?.toLowerCase().includes(filter.toLowerCase())) && (nodeFilter === "" || node === nodeFilter)) {
                //return <Deployment key={name} deployment={deployment} pods={associatedPods} />;
                return { deployment, pods: associatedPods };
            }
            return null;
        });
    }
</script>

<div class="flex flex-col h-dvh w-dvw">
    <Toolbar />
    <div class="w-full h-full flex flex-col gap-4 items-center px-8 lg:px-38 xl:px-72">
        <h1 class="text-3xl font-bold mt-4">Deployments</h1>
        <div class="flex flex-row max-w-176 w-full gap-2">
            <input
                type="text" 
                id="filter"
                placeholder="Filter deployments" 
                class="p-2 rounded-xl border border-border text-white w-full focus:border-primary outline-none duration-200" 
                bind:value={filter}
                required
            />
            <Dropdown items={ nodes } placeholder="Select a node" bind:value={nodeFilter} />
            <button 
                type="button" 
                class="bg-primary text-white px-3 pr-4 rounded-xl hover:bg-primary-hover transition flex flex-row items-center gap-2 cursor-pointer active:scale-95"
            >
                <Plus />
                New
            </button>
        </div>
        <!-- {#await both}
            <LoaderCircle class="animate-spin h-12 w-12 text-gray-500" />
        {:then data} -->
            <div class="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid w-full gap-4">
                {#each mapDeployments(deployments.items, pods) as item}
                    {#if item}
                        <Deployment deployment={item.deployment} pods={item.pods} />
                    {/if}
                {/each}
            </div>
        <!-- {:catch error}
            <div class="bg-red-500/50 border border-red-500 p-2">
                <p>{error.message}</p>
            </div>
        {/await} -->
    </div> 
</div>