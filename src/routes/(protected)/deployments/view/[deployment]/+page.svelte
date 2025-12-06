<script lang="ts">
    const { data } = $props();
    const { deployment } = data;
</script>

<div>
    <h1>{deployment.metadata?.annotations?.displayName || deployment.metadata?.name}</h1>
</div>