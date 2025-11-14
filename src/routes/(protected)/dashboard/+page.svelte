<script lang="ts">
    import Toolbar from "$lib/components/toolbar.svelte";
</script>

<div class="flex flex-col h-dvh w-dvw">
    <Toolbar />
    <div class="w-full h-full flex items-center justify-center flex-col gap-2">
        <img src="/meownel-bubblegum.png" alt="" class="pixelated relative -z-10" width={512} height={256} />
        <!-- <ActiveDeploymentList /> -->
    </div>
</div>