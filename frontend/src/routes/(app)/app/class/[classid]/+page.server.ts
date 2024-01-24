import type { PageServerLoad } from './$types';
import pClient from '$lib/server/prisma';

export const load = (async ({ params }) => {
    // Get class id
    const classId = params.classid;

    // Get class
    const classData = await pClient.class.findUnique({
        where: { class_id: classId },
        include: {
            students: true,
            teacher: {
                include: {
                    user: true,
                }
            },
        }
    });
    
    return {
        props: {
            classData,
        }
    };
}) satisfies PageServerLoad;