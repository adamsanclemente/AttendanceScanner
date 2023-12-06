import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { PrismaClientValidationError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";

import type { Actions } from "./$types";

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData();
		const username = formData.get("username");
		const password = formData.get("password");
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const email = formData.get("email");
		// basic check
		if (
			typeof username !== "string" ||
			username.length < 4 ||
			username.length > 31
		) {
			return fail(400, {
				message: "Invalid username"
			});
		}
		if (
			typeof password !== "string" ||
			password.length < 6 ||
			password.length > 255
		) {
			return fail(400, {
				message: "Invalid password"
			});
		}
        // email check
        if (
            typeof email !== "string" ||
            email.length < 6 ||
            email.length > 255
        ) {
            return fail(400, {
                message: "Invalid email"
            });
        }
        // type check on first and last name
        if (
            typeof firstName !== "string" ||
            firstName.length < 1 ||
            firstName.length > 255
        ) {
            return fail(400, {
                message: "Invalid first name"
            });
        }
        if (
            typeof lastName !== "string" ||
            lastName.length < 1 ||
            lastName.length > 255
        ) {
            return fail(400, {
                message: "Invalid last name"
            });
        }
		try {
			const user = await auth.createUser({
				key: {
					providerId: "username", // auth method
					providerUserId: username.toLowerCase(), // unique id when using "username" auth method
					password // hashed by Lucia
				},
				attributes: {
					username,
                    firstName,
                    lastName,
                    email
				}
			});
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session); // set session cookie
		} catch (e) {
			// this part depends on the database you're using
			// check for unique constraint error in user table
			if (
				e instanceof PrismaClientValidationError &&
				e instanceof PrismaClientUnknownRequestError
			) {
				return fail(400, {
					message: "Username already taken"
				});
			}
			return fail(500, {
				message: "An unknown error occurred"
			});
		}
		// redirect to
		// make sure you don't throw inside a try/catch block!
		throw redirect(302, "/");
	}
};