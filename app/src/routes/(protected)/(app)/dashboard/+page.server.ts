import { fail, redirect } from '@sveltejs/kit';
import db from '$lib/server/database/drizzle.js';
import { eq } from 'drizzle-orm';
import { superValidate } from 'sveltekit-superforms/server';
import { createSchoolSchema } from '$lib/config/zod-schemas.js';
import { schoolTable, userToSchool } from '$lib/server/database/drizzle-schemas.js';
import { setFlash } from 'sveltekit-flash-message/server';
export const load = async (event) => {
	//I only have this function here so it will check page again
	//instead of keeping it cache if it was client side only.
	//If only client side, it might still show the page even
	//if the user has logged out.
	//const session = await event.locals.auth.validate();

	const user = event.locals.user;
	if (!user) {
		redirect(302, '/auth/sign-in');
	}

	// Get all schools that the user is a member of
	const relatedSchools = await db.query.userToSchool.findMany({
		where: (userToSchool) => eq(userToSchool.userId, user.id),
		with: {
			school: {
				with: {
					classes: true,
					students: true,
				},
			},
		},
	});

	// Make a list of all the schools
	const schools = relatedSchools.map((relatedSchool) => relatedSchool.school);
	const form = await superValidate(event, createSchoolSchema)
	return {
		schools,
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, createSchoolSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Create the school
		const school = await db.insert(schoolTable).values({
			name: form.data.school_name,
			description: form.data.description,
			updatedAt: new Date(),
		}).returning()

		// Add the user to the school as an admin
		const user = event.locals.user;
		if(!user) {
			return fail(400, {
				form
			});
		}
		await db.insert(userToSchool).values({
			userId: user.id,
			schoolId: school[0].id,
			role: 'ADMIN',
		});

		setFlash({ type: 'success', message: 'School created successfully.' }, event);

		return {
			form
		};

	}

	}
