<script lang="ts">
	import { page } from '$app/state';
    import { EyeOff, ArrowLeft } from 'lucide-svelte';

    let showImage = $state(true);
</script>

<div class="flex flex-col h-dvh w-dvw items-center justify-center gap-4">
    {#if showImage}
        <img src="https://http.cat/{page.status}" alt="HTTP {page.status}"/>
    {:else}
        <h1 class="text-3xl">{page.status}: {page.error?.message || ''}</h1>
    {/if}
    <button class="flex flex-row gap-2 items-center bg-zinc-900 text-lg px-3 py-2 rounded-xl cursor-pointer" onclick={() => {showImage = !showImage}}>
        <EyeOff class="size-5" />
        {#if showImage}
            Hide Image
        {:else}
            Show Image
        {/if}
    </button>
    <button class="flex flex-row gap-2 items-center bg-zinc-900 text-lg px-3 py-2 rounded-xl cursor-pointer" onclick={() => {history.back()}}>
        <ArrowLeft class="size-5" />
        Go Back
    </button>
</div>