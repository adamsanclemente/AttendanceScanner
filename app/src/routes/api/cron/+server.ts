import type { RequestHandler } from './$types';
import db from "$lib/server/database/drizzle";
import { eq } from "drizzle-orm";
import sendEmail from '$lib/server/email-send';
import { classTable, recordTable } from "$lib/server/database/drizzle-schemas";

export const GET: RequestHandler = async (req) => {
    // Check for bearer token
    
    if (req.request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
      }

      async function markAbsent() {
        // Get all classes
        const classes = await db.query.classTable.findMany({
            with: {
                students: {
                    with: {
                        student: {
                            with: {
                                records: true,
                            },
                        },
                    },
                },
            },
        });

        // Loop through all classes
        for (const c of classes) {
            // Get the current time
            const currentTime = new Date();

            // Convert the string classTime to today's date at the classTime example of classTime: 07:30:00-05 - string
            const classTime = new Date();
            const classTimeParts = c.emailTime.split(':');
            const timeZoneOffset = -5; // timezone offset for EST
            classTime.setHours(Number(classTimeParts[0]) + timeZoneOffset);
            classTime.setMinutes(Number(classTimeParts[1]));
            classTime.setSeconds(Number(classTimeParts[2].split('-')[0]));

            // Check if the current time is past the classTime
            if (currentTime > classTime) {
                // Create an array of students who do not have a record for today 
                const students = [];
                for (const student of c.students) {
                    let absent = true;
                    for (const record of student.student.records) {
                        if (record.classId === c.id && record.timestamp.toDateString() === currentTime.toDateString()) {
                            absent = false;
                            break;
                        }
                    }
                    if (absent) {
                        students.push(student);
                    }
                }

                // Mark all students in the array as absent
                for (const student of students) {
                    // Create a record for the student
                    await db.insert(recordTable).values({
                        studentId: student.student.id,
                        classId: c.id,
                        status: 'ABSENT',
                        reason: '',
                        timestamp: new Date(),
                    });
                }
            }
        }
    }

    async function sendEmails() {
        // Query the database for all classes that have email enabled
        const emailClasses = await db.query.classTable.findMany({
            where: eq(classTable.enableEmail, true),
            with: {
                users: {
                    with: {
                        user: true,
                    },

                },
                students: {
                    with: {
                        student: {
                            with: {
                                records: true,
                            },
                        },
                    },
                },
            },
        });

        // For each class, check if the current time is past the emailTime
        for (const c of emailClasses) {
            // Get the current time
            const currentTime = new Date();

            // Convert the string email emailTime to today's date at the emailTime example of emailTime: 07:30:00-05 - string
            const emailTime = new Date();
            const emailTimeParts = c.emailTime.split(':');
            const timeZoneOffset = -5; // timezone offset for EST
            emailTime.setHours(Number(emailTimeParts[0]) + timeZoneOffset);
            emailTime.setMinutes(Number(emailTimeParts[1]));
            emailTime.setSeconds(Number(emailTimeParts[2].split('-')[0]));

            // Check if the current time is past the emailTime
            if (currentTime > emailTime) {
                // Send an email to all the users in the class
                for (const user of c.users) {
                    // Create the email body
                    let emailBody = `This is a reminder that the following students were marked absent today:\n\n`;
                    for (const student of c.students) {
                        let absent = true;
                        for (const record of student.student.records) {
                            if (record.classId === c.id && record.timestamp.toDateString() === currentTime.toDateString() && record.status === 'ABSENT') {
                                absent = false;
                                break;
                            }
                        }
                        if (absent) {
                            emailBody += `${student.student.firstName} ${student.student.lastName}\n`;
                        }
                    }

                    // Send the email
                    await sendEmail(user.user.email, 'Attendance Reminder', emailBody);
                }
            }
        }
    }

    // Run the functions
await markAbsent();
await sendEmails();


    return new Response();
};