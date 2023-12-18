import type { RequestHandler } from '@sveltejs/kit';
import pClient from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
    console.log(request.body);
    const { studentId } = await request.json() as { studentId: string };

    // Check if Student Exists
    const student = await pClient.student.findUnique({
        where: {
            student_id: studentId
        }
    });

    if (!student) {
        return new Response(JSON.stringify({ error: 'Student does not exist' }), { status: 400 });
    }

    // TODO: Make this a config variable
    // If it is between 7:00AM and 7:30AM EST (11:00AM and 11:30AM UTC), create a new record with status 'P', otherwise create a new record with status 'T'
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const status = hour === 11 && minute >= 0 && minute < 30 ? 'P' : 'T';

    // Get the student's class
    const studentClass = await pClient.class.findUnique({
        where: {
            id: student.class_id
        }
    });

    if (!studentClass) {
        return new Response(JSON.stringify({ error: 'Student has an invalid class' }), { status: 400 });
    }

    // Create a new record
    const newRecord = await pClient.record.create({
        data: {
            student_id: studentId,
            class_id: studentClass.id,
            timestamp: new Date().toISOString(),
            status: status
        }
    });

    return new Response(JSON.stringify({ student, record: newRecord }), { status: 200 });


}