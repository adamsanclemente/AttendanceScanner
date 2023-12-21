import type { LayoutServerLoad } from '../app/$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();

    if (!session) {
        return redirect(300, '/login');
    }
}) as LayoutServerLoad;