import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const user = await locals.supabase.auth.getUser();
    
    if (user.data.user) {
        throw redirect(302, '/dashboard')
    }

    return {};
}) satisfies PageServerLoad;