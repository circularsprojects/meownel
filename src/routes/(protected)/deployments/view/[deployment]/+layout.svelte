<script lang="ts">
    import type { V1Deployment } from "@kubernetes/client-node";
    import { Terminal, Folder, Info, ArrowLeft } from "lucide-svelte";
    import type { ComponentType } from "svelte";
    import { page } from '$app/state';

    const { data, children } = $props<{ data: { deployment: V1Deployment } }>();
    const { deployment }: { deployment: V1Deployment } = data;

    const tabs: { name: string; icon: ComponentType }[] = [
        { name: "Overview", icon: Info },
        { name: "Terminal", icon: Terminal },
        { name: "Files", icon: Folder }
    ];

    let activeTab = $derived.by(() => {
        const pathname = page.url.pathname;
        const segments = pathname.split('/');
        const lastSegment = segments[segments.length - 1];
        
        if (lastSegment === deployment.metadata?.name) {
            return tabs[0];
        }
        
        return tabs.find(tab => tab.name.toLowerCase() === lastSegment) || tabs[0];
    });
</script>

<div class="flex flex-col h-dvh w-dvw">
    <div class="flex flex-row w-full h-full p-4">
        <div class="flex flex-col w-80 h-full p-4 gap-4">
            <div class="flex flex-col gap-1">
                <a class="text-sm text-zinc-400 flex flex-row gap-1 items-center hover:text-zinc-500" href="/deployments"><ArrowLeft class="size-4" /> Go Back</a>
                <p class="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">{deployment.metadata?.annotations?.displayName || deployment.metadata?.name}</p>
            </div>
            <hr class="border-zinc-800">
            <div class="flex flex-col gap-2">
                {#each tabs as tab}
                    {@const Icon = tab.icon}
                    <a 
                        class="py-2 px-3 flex flex-row items-center gap-3 rounded-xl w-full cursor-pointer transition duration-200 active:scale-95 {activeTab.name === tab.name ? 'bg-zinc-900' : 'hover:bg-zinc-900'}"
                        onclick={() => activeTab = tab}
                        href="{tab.name.toLowerCase() === 'overview' ? `/deployments/view/${deployment.metadata?.name}` : `/deployments/view/${deployment.metadata?.name}/${tab.name.toLowerCase()}` }"
                    >
                        <Icon class="size-5" />
                        {tab.name}
                    </a>
                {/each}
            </div>
        </div>
        <div class="flex flex-col w-full h-full bg-background">
            {@render children()}
        </div>
    </div>
</div>