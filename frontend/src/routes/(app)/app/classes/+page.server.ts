import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import pClient from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals }) => {
    // Get session
    const session = await locals.auth.validate();
    // Check if session exists
    if (!session) throw redirect(302, "/login");

    // Get user
    const user = await pClient.user.findUnique({
        where: { id: session.user.userId },
        include: {
            classes: {
                include: {
                    class: {
                        include: {
                            students: true,
                            teacher: {
                                include: {
                                    user: true,
                                }
                            },
                        }
                    
                    }
                }
            }
        }
    });

    // Check if user exists
    if (!user) throw redirect(302, "/login");

    console.log(user);


    // Return user data with classes
    return {
        props: {
            user,
        }
    }

};

// export const actions: Actions = {
// };