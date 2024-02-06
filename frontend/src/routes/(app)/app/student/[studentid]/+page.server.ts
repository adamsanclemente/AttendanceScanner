import type { PageServerLoad } from './$types';
import pClient from '$lib/server/prisma';

export const load = (async ({ params }) => {
    // Get class id
    const studentId = params.studentid;

    // Get class
    const studentData = await pClient.student.findUnique({
        where: { student_id: studentId },
        include: {
            class: {
                include: {
                    teacher: {
                        include: {
                            user: true,
                        }
                    },
                },
                
            },
        }
    });
    
    return {
        props: {
            studentData,
        }
    };
}) satisfies PageServerLoad;