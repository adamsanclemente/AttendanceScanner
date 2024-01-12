import { redirect, fail } from "@sveltejs/kit";
import { auth } from "$lib/server/lucia";
import type { PageServerLoad, Actions } from "./$types";
import pClient from "$lib/server/prisma";

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, "/login");
	return {
		userId: session.user.userId,
		username: session.user.username,
        email: session.user.email,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
		image: session.user.image,
	};
};

export const actions: Actions = {
	logout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId); // invalidate session
		locals.auth.setSession(null); // remove cookie
		throw redirect(302, "/login"); // redirect to login page
	},
	updateProfile: async ({ request }) => {
		// Get form data
		const formData = await request.formData();

		// Get form fields
		const image = formData.get("image") as string;
		const firstName = formData.get("firstName") as string;
		const lastName = formData.get("lastName") as string;
		const id = formData.get("userId") as string;

		// Get User from database
		const user = await pClient.user.findUnique({
			where: { id },
		});

		// Check if user exists
		if (!user) return fail(404);

		// Update user
		await pClient.user.update({
			where: { id },
			data: {
				image,
				firstName,
				lastName,
			},
		});

		// Return success
		return {
			status: 200,
			body: {
				message: "Profile updated successfully",
			},
		};
	},
};