<script lang="ts">
    import { Settings } from "lucide-svelte";
    let { name, image } = $props();
</script>

<div class="w-full border border-zinc-800 p-2 rounded-xl flex flex-row justify-between">
    <div>
        <h2 class="text-md font-bold overflow-hidden text-ellipsis whitespace-nowrap">{name}</h2>
        <p class="text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap max-w-[16rem]">
            {image}
        </p>
    </div>
    <button class="flex items-center justify-center p-2 rounded-sm bg-zinc-800 border-zinc-700 border aspect-square hover:bg-zinc-700 hover:border-zinc-600 duration-100 cursor-pointer active:bg-zinc-600">
        <Settings />
    </button>
</div>