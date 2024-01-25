import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
    const session = await locals.auth.validate();

    if (!session) {
        return redirect(300, '/login');
    }

    // Check if user is admin
    if (!session.user.admin) {
        return redirect(300, '/app');
    }

    return {};
}) satisfies LayoutServerLoad;