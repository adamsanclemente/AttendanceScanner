import type { PageServerLoad } from './$types';
import db from '$lib/server/database/drizzle';
import { eq } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { deleteStudentSchema, updateStudentSchema } from '$lib/config/zod-schemas';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { setFlash } from 'sveltekit-flash-message/server';
import { studentTable } from '$lib/server/database/drizzle-schemas';

export const load = (async (event) => {
    // Fetch the student from the database

    const studentId = event.params.studentid;

    const student = await db.query.studentTable.findFirst({
        where: (student) => eq(student.id, studentId),
        with: {
            records: {
                with: {
                    class: true,
                },
            },
            classes: {
                with: {
                   class: true,
                },
            }
        },
    });
    
    // Check if the student exists
    if (!student) {
        redirect(302, '/dashboard');
    }

    // Check if the user is a member of the school
    const user = event.locals.user;
    if (!user) {
        return redirect(302, '/auth/sign-in');
    }

    const userSchool = await db.query.userToSchool.findFirst({
        where: (userSchool) => eq(userSchool.schoolId, student.schoolId) && eq(userSchool.userId, user.id),
    });

    const formattedStudent = {
        school_id: student.id,
        first_name: student.firstName,
        last_name: student.lastName,
        grad_year: student.gradYear,
        email: student.email,
    }

    const updateForm = await superValidate(formattedStudent, updateStudentSchema);
    const deleteForm = await superValidate(event, deleteStudentSchema);

    if (!userSchool) {
        return redirect(302, '/dashboard');
    }

    // Return the student
    return {
        student,
        admin: userSchool.role === 'ADMIN',
        updateForm,
        deleteForm,
    }
}) satisfies PageServerLoad;

export const actions = {
	update: async (event) => {
		const updateForm = await superValidate(event, updateStudentSchema);

		if (!updateForm.valid) {
			return fail(400, {
				updateForm
			});
		}

        // Update the student
        const studentId = event.params.studentid;
        const student = await db.query.studentTable.findFirst({
            where: (student) => eq(student.id, studentId),
        });

        if (!student) {
            setError(updateForm, 'Student not found.');
        }

        await db.update(studentTable).set({
            id: updateForm.data.school_id,
            firstName: updateForm.data.first_name,
            lastName: updateForm.data.last_name,
            gradYear: updateForm.data.grad_year,
        }).where(eq(studentTable.id, studentId));


        

		setFlash({ type: 'success', message: 'Student updated successfully.' }, event);

		return {
			updateForm
		};

	},
    delete: async (event) => {
        const deleteForm = await superValidate(event, deleteStudentSchema);

        if (!deleteForm.valid) {
            return fail(400, {
                deleteForm
            });
        }

        // Delete the student
        const studentId = event.params.studentid;
        const student = await db.query.studentTable.findFirst({
            where: (student) => eq(student.id, studentId),
        });

        if (!student) {
            setError(deleteForm, 'Student not found.');
        }

        await db.delete(studentTable).where(eq(studentTable.id, studentId));

        setFlash({ type: 'success', message: 'Student deleted successfully.' }, event);

        return {
            deleteForm
        };
    }

	}