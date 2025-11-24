<script lang="ts">
    import { authClient } from "$lib/auth-client";
    import { toast } from 'svelte-sonner'

    let email = $state("");
    let password = $state("");

    async function onsubmit(event: Event) {
        event.preventDefault();
        const loginToast = toast.loading("Logging in...");
        await authClient.signIn.email({
            email,
            password
        }, {
            onSuccess() {
                toast.success("Logged in successfully!", {
                    id: loginToast
                });
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1000);
            },
            onError(ctx: { error: { message: any; }; }) {
                toast.error(ctx.error.message, {
                    id: loginToast
                });
            }
        })
    }
</script>

<div class="flex justify-center items-center h-dvh w-dvw">
    <div class="flex flex-col p-8 rounded-3xl sm:border-zinc-900 sm:border w-full sm:w-lg shadow-lg">
        <h1 class="text-3xl font-bold">meownel</h1>
        <p>a custom kubernetes-based minecraft panel</p>
        <form {onsubmit} class="flex flex-col justify-evenly items-center mt-4 gap-2">
            <input
                type="email" 
                id="email"
                placeholder="Email" 
                class="p-2 rounded-xl border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200" 
                bind:value={email}
                required
            />
            <input
                type="password"
                id="password"
                placeholder="Password"
                class="p-2 rounded-xl border border-zinc-800 text-white w-full focus:border-pink-500 outline-none duration-200"
                bind:value={password}
                required
            />
            <button 
                type="submit" 
                class="bg-pink-500 text-white p-2 rounded-xl w-full hover:bg-pink-600 transition duration-200"
            >
                Sign In
            </button>
        </form>
    </div>
</div>