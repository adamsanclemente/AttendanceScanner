// @ts-nocheck
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
    const user = await locals.supabase.auth.getUser();
    if (!user.data.user) {
        throw error(401, 'Unauthorized');
    }
}