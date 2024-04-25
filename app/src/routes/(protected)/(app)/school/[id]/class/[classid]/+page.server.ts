import type { PageServerLoad } from './$types';
import db from '$lib/server/database/drizzle';
import { eq, gte, lte } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { manualAttendanceSchema, updateStudentsToClassSchema, updateClassSettingsSchema} from '$lib/config/zod-schemas';
import { recordTable, studentToClass, classTable } from '$lib/server/database/drizzle-schemas';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = (async (event) => {
    // Get the school and class id from the params
    const classid = event.params.classid;
    const schoolId = event.params.id;

    // Get the class from the database
    const c = await db.query.classTable.findFirst({
        where: (classTable) => eq(classTable.id, classid),
        with: {
            users: true,
            students: true,
        },
    });

    if (!c) {
        return redirect(302, '/dashboard');
    }

    // Check if the user is a member of the class
    const user = event.locals.user;
    if (!user) {
        return redirect(302, '/auth/sign-in');
    }

    const userClass = await db.query.userToClass.findFirst({
        where: (userClass) => eq(userClass.classId, classid) && eq(userClass.userId, user.id),
    });

    // Check if the user is a school admin
    const userSchool = await db.query.userToSchool.findFirst({
        where: (userToSchool) => eq(userToSchool.schoolId, c.schoolId) && eq(userToSchool.userId, user.id),
    });

    if (!userSchool) {
        return redirect(302, '/dashboard');
    }

    // Get the records between 12:00am and 11:59pm of the current day
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    let records = await db.query.recordTable.findMany({
        where: (record) => eq(record.classId, c.id) && lte(record.timestamp, end) && gte(record.timestamp, start),
        with: {
            student: true,
        },
    });

    // Remove all reecords that are not from today
    records = records.filter((record) => {
        return record.timestamp >= start && record.timestamp <= end;
    });

    // Remove all record that are not for the current class
    records = records.filter((record) => {
        return record.classId === c.id;
    });

    const students = await db.query.studentToClass.findMany({
        where: (studentToClass) => eq(studentToClass.classId, classid),
        with: {
            student: true,
        },
    });

    // Make an array of all the students who do not have a record for today
    let unmarkedStudents = students.filter((student) => {
        return !records.find((record) => record.studentId === student.studentId);
    });

    if(!unmarkedStudents) {
        unmarkedStudents = [];
    }

    const studentsInSchool = await db.query.studentTable.findMany({
        where: (studentTable) => eq(studentTable.schoolId, schoolId),
        with: {
            classes: true,
        }
    });

    const form = await superValidate(event, manualAttendanceSchema);
    const formAddStudents = await superValidate(event, updateStudentsToClassSchema);
    const formUpdateClassSettings = await superValidate(event, updateClassSettingsSchema);

    const users = await db.query.userTable.findMany();

    if (!userClass) {
        
        if (userSchool.role === 'ADMIN') {
            // If the user is an admin, they can view the class
            return {
                class: c,
                admin: true,
                students,
                unmarkedStudents,
                records,
                form,
                formAddStudents,
                formUpdateClassSettings,
                studentsInSchool,
                users,
            };
        }
        return redirect(302, '/dashboard');
    }


    return {
        class: c,
        admin: userClass.role === 'ADMIN',
        students,
        unmarkedStudents,
        records,
        form,
        formAddStudents,
        formUpdateClassSettings,
        studentsInSchool,
        users,
    };
}) satisfies PageServerLoad;

export const actions = {
    manualAttendance: async (event) => {
        const form = await superValidate(event, manualAttendanceSchema);

        if (!form.valid) {
            return {
                form,
            };
        }

        const user = event.locals.user;
        if (!user) {
            return {
                form,
            };
        }

        // get the classid from the params
        const classid = event.params.classid;

        // Check to see if the user alreeady has a record for today
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
        const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

        const ogrecord = await db.query.recordTable.findFirst({
            where: (record) => eq(record.studentId, form.data.student_id) && eq(record.classId, classid) && lte(record.timestamp, end) && gte(record.timestamp, start),
        });

        // If the user already has a record for today, update it
        if (ogrecord) {

            const currentId = ogrecord.id;
            await db.update(recordTable).set({
                status: form.data.status,
                timestamp: new Date(),
                reason: form.data.reason,
            }).where(eq(recordTable.id, currentId));
        } else {
            // If the user does not have a record for today, create one
            await db.insert(recordTable).values({
                studentId: form.data.student_id,
                classId: classid,
                status: form.data.status,
                timestamp: new Date(),
            });
        }

        setFlash({ type: 'success', message: 'Attendance recorded successfully.' }, event);

        return {
            form,
        };
    },

    updateStudents: async (event) => {
        const form = await superValidate(event, updateStudentsToClassSchema);

        if (!form.valid) {
            return {
                formAddStudents: form,
            };
        }

        const user = event.locals.user;
        if (!user) {
            return {
                formAddStudents: form,
            };
        }

        // get the classid from the params
        const classId = event.params.classid;
        
        // Remove students from the class
        const studentIdsToBeInClass = form.data.students;
        await db.transaction(async () => {
            await db.delete(studentToClass)
                .where(eq(studentToClass.classId, classId));

            // Add students to the class
            await db.insert(studentToClass).values(
                studentIdsToBeInClass.map(studentId => ({
                    studentId,
                    classId,
                }))
            );
        }).catch((e) => {
            setFlash({ type: 'error', message: 'An error occurred while updating students.' }, event);
            console.error('Error updating students:', e);
        }).then(() => {
            setFlash({ type: 'success', message: 'Students updated successfully.' }, event);
        });

        return {
            formAddStudents: form,
        };
    },

    updateSettings: async (event) => {
        const form = await superValidate(event, updateClassSettingsSchema);
        const classId = event.params.classid;
        
        if (!form.valid) {
            return {
                formUpdateClassSettings: form,
            };
        }

        await db.update(classTable)
            .set({
                name: form.data.name,
                description: form.data.description,
                enableEmail: form.data.email_enable === 'true' ? true : false,
                emailTime: form.data.email_time,
            })
            .where(eq(classTable.id, classId)).catch((e) => {
                setFlash({ type: 'error', message: 'An error occurred while updating class settings.' }, event);
                console.error('Error updating class settings:', e);
            }).then(() => {
                setFlash({ type: 'success', message: 'Class settings updated successfully.' }, event);
            });
        
        return {
            formUpdateClassSettings: form,
        }
        
    }
}