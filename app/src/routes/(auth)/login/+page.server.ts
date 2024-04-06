import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    const user = await locals.supabase.auth.getUser();
    
    if (user.data.user) {
        throw redirect(302, '/dashboard')
    }

    return {};
}) satisfies PageServerLoad;

export const actions = {
    logIn: async ({request, locals}) => {
        const data = await request.formData();
        const email = data.get('email') as string;

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: email,
            options: {
                emailRedirectTo: '/dashboard'
            }
        });

        if (error) {
            throw redirect(302, '/login');
        }
    }
}
