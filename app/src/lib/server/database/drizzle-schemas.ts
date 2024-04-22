import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const userTable = pgTable('users', {
	id: text('id').notNull().primaryKey(),
	provider: text('provider').notNull().default('email'),
	providerId: text('provider_id').notNull().default(''),
	email: text('email').notNull().unique(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	role: text('role').notNull().default('USER'),
	verified: boolean('verified').notNull().default(false),
	receiveEmail: boolean('receive_email').notNull().default(true),
	password: text('password'),
	token: text('token').unique(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const userRelations = relations(userTable, ({ many }) => ({
	schools: many(userOnSchoolTable),
	classes: many(userOnClassTable)
}));


export const sessionTable = pgTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp('expires_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const studentTable = pgTable('students', {
	id: text('id').notNull().primaryKey(),
	firstName: text('first_name').notNull(),
	lastName: text('last_name').notNull(),
	email: text('email').unique(),
	gradYear: text('grad_year').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const studentRelations = relations(studentTable, ({ many }) => ({
	classes: many(studentOnClassTable),
	schools: many(studentOnSchoolTable),
	records: many(recordOnStudentTable)
}));

export const classTable = pgTable('classes', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const classRelations = relations(classTable, ({ many }) => ({
	students: many(studentOnClassTable),
	teachers: many(userOnClassTable),
	schools: many(classOnSchoolTable),
	records: many(recordOnClassTable)
}));

export const schoolTable = pgTable('schools', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	createdAt: timestamp('created_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', {
		withTimezone: true,
		mode: 'date'
	}).notNull()
});

export const schoolRelations = relations(schoolTable, ({ many }) => ({
	students: many(studentOnSchoolTable),
	teachers: many(userOnSchoolTable),
	admins: many(userOnSchoolTable),
	classes: many(classOnSchoolTable),
}));

export const statusEnum = pgEnum('status', ['PRESENT', 'ABSENT', 'TARDY', 'COOP']);

export const recordTable = pgTable('records', {
	id: text('id').notNull().primaryKey(),
	studentId: text('student_id')
		.notNull()
		.references(() => studentTable.id),
	classId: text('class_id')
		.notNull()
		.references(() => classTable.id),
	timestamp: timestamp('timestamp', {
		withTimezone: true,
		mode: 'date'
	}).notNull(),
	status: statusEnum('status').notNull(),
	reason: text('reason')
});

export const recordRelations = relations(recordTable, ({ one }) => ({
	student: one(recordOnStudentTable,),
	class: one(recordOnClassTable)
}));

export const studentOnClassTable = pgTable('students_on_classes', {
	id: text('id').notNull().primaryKey(),
	studentId: text('student_id')
		.notNull()
		.references(() => studentTable.id),
	classId: text('class_id')
		.notNull()
		.references(() => classTable.id)
});

export const studentOnSchoolTable = pgTable('students_on_schools', {
	id: text('id').notNull().primaryKey(),
	studentId: text('student_id')
		.notNull()
		.references(() => studentTable.id),
	schoolId: text('school_id')
		.notNull()
		.references(() => schoolTable.id)
});

export const userOnSchoolTable = pgTable('users_on_schools', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	schoolId: text('school_id')
		.notNull()
		.references(() => schoolTable.id)
});

export const userOnClassTable = pgTable('users_on_classes', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => userTable.id),
	classId: text('class_id')
		.notNull()
		.references(() => classTable.id)
});

export const classOnSchoolTable = pgTable('classes_on_schools', {
	id: text('id').notNull().primaryKey(),
	classId: text('class_id')
		.notNull()
		.references(() => classTable.id),
	schoolId: text('school_id')
		.notNull()
		.references(() => schoolTable.id)
});

export const recordOnStudentTable = pgTable('records_on_students', {
	id: text('id').notNull().primaryKey(),
	recordId: text('record_id')
		.notNull()
		.references(() => recordTable.id),
	studentId: text('student_id')
		.notNull()
		.references(() => studentTable.id)
});

export const recordOnClassTable = pgTable('records_on_classes', {
	id: text('id').notNull().primaryKey(),
	recordId: text('record_id')
		.notNull()
		.references(() => recordTable.id),
	classId: text('class_id')
		.notNull()
		.references(() => classTable.id)
});

export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;
export type Session = typeof sessionTable.$inferInsert;
