<script lang="ts">
    import { Server } from 'lucide-svelte';

    let { name } = $props();
</script>

<div class="w-full border-l-4 border-zinc-800 p-2 rounded-md flex flex-row justify-between">
    <div class="flex items-center gap-2">
        <Server />
        <h2 class="text-md font-bold">{name}</h2>
    </div>
</div>