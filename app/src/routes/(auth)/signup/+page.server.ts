import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
export const load = (async ({ locals }) => {
    const user = await locals.supabase.auth.getUser();
    
    if (user.data.user) {
        throw redirect(302, '/dashboard')
    }

    return {};
}) satisfies PageServerLoad;

export const actions = { 
    signUp: async ({request, locals}) => {
        const data = await request.formData();
        const email = data.get('email') as string;

        const { error } = await locals.supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: '/dashboard'
            }
        });

        if (error) {
            fail(500, { message: error.message})
        }



    }
}