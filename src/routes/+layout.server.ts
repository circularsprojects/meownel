import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.session) {
        return {
            user: locals.user
        };
    }
}