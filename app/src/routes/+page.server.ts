import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {

    // Check if the user is logged in and return the user
    if (!await locals.supabase.auth.getSession()) {
        return {
            user: null
        };
    }
    

    const user = await locals.supabase.auth.getUser();

    return {
        user: user.data.user
    };
}) satisfies PageServerLoad;