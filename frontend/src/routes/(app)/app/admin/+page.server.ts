import type { PageServerLoad } from './$types';
import pClient from '$lib/server/prisma';
export const load = (async () => {
    // Get all classes
    const classes = await pClient.class.findMany({
        include: {
            students: true,
            teacher: {
                include: {
                    user: true,
                }
            },
        }
    });

    // Get all students
    const students = await pClient.student.findMany({
        include: {
            class: true,
        }
    });

    // Get all users
    const users = await pClient.user.findMany({ include: { classes: true }});
    return {
        props: {
            classes,
            students,
            users,
        }
    };
}) satisfies PageServerLoad;