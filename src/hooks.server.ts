import { auth } from "$lib/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import { building } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
    const session = await auth.api.getSession({
        headers: event.request.headers,
    });

    if (session) {
        event.locals.session = session.session;
        event.locals.user = session.user;
    } else {
        if (event.route.id?.startsWith("/(protected)/")) {
            redirect(307, "/");
        }
    }

    return svelteKitHandler({ event, resolve, auth, building });
}