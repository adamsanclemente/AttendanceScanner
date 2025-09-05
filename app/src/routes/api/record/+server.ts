
import type { RequestHandler } from './$types';
import db from '$lib/server/database/drizzle';
import { eq, gte, lte } from 'drizzle-orm';
import { classTable, recordTable, studentTable, studentToClass } from '$lib/server/database/drizzle-schemas';
import { SCANNER_API_KEY } from '$env/static/private';

export const POST: RequestHandler = async ({ url }) => {
    // Get the school and class id from the params
    let classId = url.searchParams.get('classId');
    const studentId = url.searchParams.get('studentId');
    const apikey = url.searchParams.get('apikey');

    // Check all inputs are present
    if (!classId || !studentId || !apikey) {
        return new Response((JSON.stringify({ status: 'error', message: 'Missing Parameters' })), { status: 400 });
    }

    // Check the api key
    if (!SCANNER_API_KEY || apikey !== SCANNER_API_KEY) {
        return new Response((JSON.stringify({ status: 'error', message: 'Invalid API Key' })), { status: 403 });
    }

    // Get the student
    const student = await db.query.studentTable.findFirst({
        where: eq(studentTable.id, studentId),
    });

    if (!student) {
        return new Response((JSON.stringify({ status: 'error', message: 'Student Not Found' })), { status: 404 });
    }

    if(classId === 'anyclass') {
        // find the class the student is in
        const studentToClass2 = await db.query.studentToClass.findFirst({
            where: eq(studentToClass.studentId, studentId),
        });

        if (!studentToClass2) {
            return new Response((JSON.stringify({ status: 'error', message: 'Student Not In Any Class' })), { status: 404 });
        }

        classId = studentToClass2.classId;
    }

    // Get the class
    const c = await db.query.classTable.findFirst({
        where: eq(classTable.id, classId),
    });

    if (!c) {
        return new Response((JSON.stringify({ status: 'error', message: 'Class Not Found' })), { status: 404 });
    }

    // Check to see if the is in the class
    const studentInClass = await db.query.studentToClass.findFirst({
        where: (studentToClass) => eq(studentToClass.classId, classId) && eq(studentToClass.studentId, studentId),
    });

    if (!studentInClass) {
        return new Response((JSON.stringify({ status: 'error', message: 'Student Not In Class' })), { status: 404 });
    }

    // Check to see if the student already has a record for today
    const today = new Date();
    // Convert today to UTC
    today.setHours(today.getHours() - 4);

    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const record = await db.query.recordTable.findFirst({
        where: (record) => eq(record.classId, classId) && eq(record.studentId, studentId) && gte(record.timestamp, start) && lte(record.timestamp, end),
    });



    if (record && record.id === studentId && (record.timestamp >= start && record.timestamp <= end)) {
        return new Response((JSON.stringify({ status: 'error', message: 'Record Already Exists For Today' })), { status: 400 });
    }

    // Find all record for the student
    const allRecords = await db.query.recordTable.findMany({
        where: eq(recordTable.studentId, studentId),
    });

    // Loop through all the records and check if the student has a record for today
    for (const record of allRecords) {
        const recordDate = new Date(record.timestamp);

        // Extract only the date from the timestamp
        const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (recordDateOnly.getTime() === todayDateOnly.getTime()) {
            return new Response((JSON.stringify({ status: 'error', message: 'Record Already Exists For Today' })), { status: 400 });
        }
    }



    if (record && record.id === studentId) {
        // Double check to see if there isn't a record for the student today
        const recordDate = new Date(record.timestamp);

        // Extract only the date from the timestamp
        const recordDateOnly = new Date(recordDate.getFullYear(), recordDate.getMonth(), recordDate.getDate());
        const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        if (recordDateOnly.getTime() === todayDateOnly.getTime()) {
            return new Response((JSON.stringify({ status: 'error', message: 'Record Already Exists For Today' })), { status: 400 });
        }
    }

    
    // Determine if the student is late based on c.emailtime
    const emailTime = c.emailTime.split(':');
    const emailHour = Number(emailTime[0]);
    const adjustedEmailHour = emailHour < 12 ? emailHour + 12 : emailHour;
    const emailDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), adjustedEmailHour, Number(emailTime[1]), 0);

    let status: "PRESENT" | "TARDY" = 'PRESENT';
    if (today > emailDate) {
        status = 'TARDY';
    }

    console.log(emailDate, today, status)

    // Create the record
    const newRecord = await db.insert(recordTable).values({
        studentId: studentId,
        classId: classId,
        status: status,
        reason: '',
        timestamp: new Date(),
    });

    if (!newRecord) {
        return new Response((JSON.stringify({ status: 'error', message: 'Error Creating Record' })), { status: 500 });
    } else {
        console.info(`Record created for ${student.firstName} ${student.lastName} in class ${c.name} - ${status}`);
        return new Response((JSON.stringify({ status: 'success', studentName: `${student.firstName} ${student.lastName}`, recordstatus: status })), { status: 200 });
    }
};