import type { RequestHandler } from '@sveltejs/kit';
import pClient from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
    const { studentId } = await request.json();

    // Check if Student Exists
    const student = await pClient.student.findUnique({
        where: {
            student_id: studentId
        }
    });

    if (!student) {
        return new Response(JSON.stringify({ error: 'Student does not exist' }), { status: 400 });
    }

    // Check if there is a record for the student created today already
    const record = await pClient.record.findFirst({
        where: {
            student_id: studentId,
            timestamp: new Date().toISOString().slice(0, 10)
        }
    });

    // If there is a record already, return the student info and the record info
    if (record) {
        return new Response(JSON.stringify({ student, record }), { status: 300 });
    }

    // TODO: Make this a config variable
    // If it is between 7:00AM and 7:30AM EST (11:00AM and 11:30AM UTC), create a new record with status 'P', otherwise create a new record with status 'T'
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const status = hour === 11 && minute >= 0 && minute < 30 ? 'P' : 'T';

    const newRecord = await pClient.record.create({
        data: {
            student_id: studentId,
            class_id: student.class_id,
            timestamp: new Date().toISOString().slice(0, 10),
            status: status
        }
    });

    return new Response(JSON.stringify({ student, record: newRecord }), { status: 200 });


}