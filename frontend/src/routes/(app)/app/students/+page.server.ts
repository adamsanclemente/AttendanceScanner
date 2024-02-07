import type { PageServerLoad } from './$types';
import pClient from '$lib/server/prisma';

export const load = (async () => {
    const students = await pClient.student.findMany({
        include: {
            class: true
        }
    });

    return {
        props: {
            students
        }
    };
}) satisfies PageServerLoad;