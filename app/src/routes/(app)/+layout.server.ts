import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals }) => {
    const user = await locals.supabase.auth.getUser();
    if (!user.data.user) {
        throw error(401, 'Unauthorized');
    }
}