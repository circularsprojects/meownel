<script lang="ts">
    import Toolbar from "$lib/components/toolbar.svelte";
    import FormInput from "$lib/components/formInput.svelte";
    import Dropdown from "$lib/components/dropdown.svelte";

    let label = $state("");
    let name = $state("");
    let node = $state("");
    let image = $state("");
    let dataMountPath = $state("");

    let { data } = $props();
    let { nodes }: { nodes: string[] } = data;

    let autoName = $derived.by(() => {
        return label == "" ? "my-awesome-server" : label.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    });

    async function onsubmit(event: Event) {
        event.preventDefault();
    }
</script>

<div class="flex flex-col h-dvh w-dvw">
    <Toolbar />
    <div class="flex justify-center items-center h-dvh w-dvw">
        <div class="flex flex-col gap-6 p-8 sm:border-primary sm:border-2 w-full sm:w-3xl shadow-lg rounded-3xl">
            <h1 class="text-3xl font-bold">Creating a new Deployment</h1>
            <form {onsubmit} class="flex flex-col justify-evenly gap-4">
                <FormInput
                    label="Deployment Label"
                    id="label"
                    placeholder="My Awesome Server!!11!!"
                    bind:value={label}
                    required
                />

                <FormInput
                    label="Deployment Name"
                    id="name"
                    placeholder={autoName}
                    bind:value={name}
                />

                <div class="flex flex-col gap-2 w-full">
                    <label for="node">
                        Deployment Node
                        <span class="text-sm text-red-400">(required)</span>
                    </label>
                    <Dropdown items={ nodes } placeholder="Select a node" bind:value={node} id="node" />
                </div>

                <FormInput
                    label="Container Image"
                    id="image"
                    placeholder="itzg/minecraft-server:latest"
                    bind:value={image}
                    required
                />

                <FormInput
                    label="Data Mount Path"
                    id="data-mount-path"
                    placeholder="~/servers/minecraft-server"
                    bind:value={dataMountPath}
                    required
                />

                <button 
                    type="submit" 
                    class="bg-primary text-white p-2 rounded-xl w-full hover:bg-primary-hover transition duration-200"
                >
                    Create Deployment
                </button>
            </form>
        </div>
    </div>
</div>