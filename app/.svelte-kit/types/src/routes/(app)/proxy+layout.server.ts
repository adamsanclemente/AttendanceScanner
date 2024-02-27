// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types'

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
    const user = await locals.supabase.auth.getUser();
    if (!user.data.user) {
        throw redirect(302, '/login');
    }
}