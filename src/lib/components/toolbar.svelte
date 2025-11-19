<script lang="ts">
    import { authClient } from "$lib/auth-client";
    import type { PageProps } from "../../routes/$types";

    function onclick() {
        authClient.signOut({
            fetchOptions: {
                onSuccess() {
                    window.location.href = "/";
                }
            }
        });
    }

    const session = authClient.useSession();
</script>

<div class="flex w-dvw flex-row items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900">
    <div class="flex flex-row items-center gap-4">
        <h1 class="text-2xl font-bold">meownel</h1>
        <a href="/dashboard" class="hover:border-b-4 border-primary duration-150 text-lg">home</a>
        <a href="/deployments" class="hover:border-b-4 border-primary duration-150 text-lg">deployments</a>
    </div>
    <div class="hidden sm:flex flex-row items-center gap-4">
        <p class="text-sm text-muted">Logged in as {$session.data?.user.name}</p>
        <div class="w-px h-8 bg-zinc-800"></div>
        <button 
            class="text-sm text-primary hover:underline cursor-pointer"
            {onclick}
        >
            Sign out
        </button>
    </div>
</div>