import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = await locals.supabase.auth.getUser();
    if (!user.data.user) {
        throw redirect(302, '/login');
    }
}