import type { PageServerLoad } from './$types';
import db from '$lib/server/database/drizzle';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { createClassSchema, createStudentSchema, editSchoolSchema } from '$lib/config/zod-schemas';
import { classTable, schoolTable, studentTable, userToClass } from '$lib/server/database/drizzle-schemas';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
    // Get the school id from the params
    const id = event.params.id;

    // Get the school from the database
    const school = await db.query.schoolTable.findFirst({
        where: (school) => eq(school.id, id),
        with: {
            classes: {
                with: {
                    users: true,
                }
            },
            students: true,
        },
    });

    // Check if the user is a member of the school
    const user = event.locals.user;
    if (!user) {
        return redirect(302, '/auth/sign-in');
    }

    const userSchool = await db.query.userToSchool.findFirst({
        where: (userSchool) => eq(userSchool.schoolId, id) && eq(userSchool.userId, user.id),
    });

    if (!userSchool) {
        return redirect(302, '/dashboard');
    }

    if (!school) {
        return redirect(302, '/dashboard');
    }

    // Get all the classes that the user is a member of in the school
    let classes = await db.query.classTable.findMany({
        where: (classTable) => eq(classTable.schoolId, id),
        with: {
            users: {
                where: (users) => eq(users.userId, user.id),
            },
        },
    });

    // If the user is an admin, get set the classes to all the classes in the school
    if(userSchool.role === 'ADMIN') {
        classes = school.classes;
    }

    const populatedSchool = {
        school_name: school.name,
        description: school.description,
    }

    const form = await superValidate(event, createClassSchema)
    const addForm = await superValidate(event, createStudentSchema)
    const editForm = await superValidate(populatedSchool, editSchoolSchema)

    // Return the school
    return {
        school,
        classes,
        form,
        addForm,
        editForm,
        admin: userSchool.role === 'ADMIN',
    };


}) satisfies PageServerLoad;

export const actions = {
	addClass: async (event) => {
		const form = await superValidate(event, createClassSchema);

        const schoolId = event.params.id;

		console.log(form)

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Create the class
		const c = await db.insert(classTable).values({
			name: form.data.class_name,
			description: form.data.description,
			updatedAt: new Date(),
            schoolId: schoolId,
		}).returning()

		// Add the user to the class as an admin
		const user = event.locals.user;
		if(!user) {
			return fail(400, {
				form
			});
		}
		await db.insert(userToClass).values({
			userId: user.id,
			classId: c[0].id,
			role: 'ADMIN',
		});

		setFlash({ type: 'success', message: 'Class created successfully.' }, event);

		return {
			form
		};
	},
    addStudent: async (event) => {
        const addForm = await superValidate(event, createStudentSchema);

        const schoolId = event.params.id;

        // Creeate the student
        const student = await db.insert(studentTable).values({
            firstName: addForm.data.first_name,
            lastName: addForm.data.last_name,
            gradYear: addForm.data.grad_year,
            email: addForm.data.email,
            schoolId: schoolId,
            id: addForm.data.school_id,
            updatedAt: new Date(),
        }).returning()

        if(!student) {
            setError(addForm, 'There was a problem creating the student.');
        }

        setFlash({ type: 'success', message: 'Student created successfully.' }, event);

        return {
            addForm
        };
    },
    editSchool: async (event) => {
        const editForm = await superValidate(event, editSchoolSchema);

        const schoolId = event.params.id;

        // Update the school
        await db.update(schoolTable).set({
            name: editForm.data.school_name,
            description: editForm.data.description,
            updatedAt: new Date(),
        }).where(eq(schoolTable.id, schoolId));

        setFlash({ type: 'success', message: 'School updated successfully.' }, event);

        return {
            editForm
        };
    }

	}