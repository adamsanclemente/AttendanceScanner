import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, pgEnum, primaryKey, uuid, time } from 'drizzle-orm/pg-core';

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

// Enums
export const statusEnum = pgEnum('status', ['PRESENT', 'ABSENT', 'TARDY', 'COOP']);
export const roleEnum = pgEnum('role', ['TEACHER', 'ADMIN']);

// Students
export const studentTable = pgTable('students', { 
	id: text('id').primaryKey(), 
	firstName: text('first_name').notNull(), 
	lastName: text('last_name').notNull(), 
	email: text('email').notNull(), 
	gradYear: text('grad_year').notNull(), 
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(), 
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(), 
	schoolId: uuid('school_id').notNull().references(() => schoolTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
});

// Classes
export const classTable = pgTable('classes', { 
	id: uuid('id').primaryKey().defaultRandom(), 
	name: text('name').notNull(), 
	description: text('description'),
	enableEmail: boolean('enable_email').notNull().default(true),
	emailTime: time('email_time', { withTimezone: true }).notNull().default('07:30:00-05:00'),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(), 
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(), 
	schoolId: uuid('school_id').notNull().references(() => schoolTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
});

// Schools
export const schoolTable = pgTable('schools', { 
	id: uuid('id').primaryKey().defaultRandom(), 
	name: text('name').notNull(), 
	description: text('description').notNull().default(''),
	createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(), 
	updatedAt: timestamp('updated_at', { mode: 'date', withTimezone: true }).notNull() 
});

// Records
export const recordTable = pgTable('records', { 
	id: uuid('id').primaryKey().defaultRandom(), 
	studentId: text('student_id').notNull().references(() => studentTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
	classId: uuid('class_id').notNull().references(() => classTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}),
	status: statusEnum('status').notNull(), 
	reason: text('reason'), 
	timestamp: timestamp('created_at', { mode: 'date', withTimezone: true }).defaultNow().notNull(), 
});


// Relation Tables //

// User to School (Many to Many)
export const userToSchool = pgTable('user_to_school', { 
	userId: text('user_id').notNull().references(() => userTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}), 
	schoolId: uuid('school_id').notNull().references(() => schoolTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}), 
	role: roleEnum('role').notNull() 
},
(t) => ({
	pk: primaryKey({ columns: [t.userId, t.schoolId] })
}),
);

// User to Class (Many to Many)
export const userToClass = pgTable('user_to_class', { 
	userId: text('user_id').notNull().references(() => userTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}), 
	classId: uuid('class_id').notNull().references(() => classTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}), 
	role: roleEnum('role').notNull() 
},
(t) => ({
	pk: primaryKey({ columns: [t.userId, t.classId] })
}),
);

// Student to Class (Many to Many)
export const studentToClass = pgTable('student_to_class', { 
	studentId: text('student_id').notNull().references(() => studentTable.id, {onDelete: 'cascade', onUpdate: 'cascade'}), 
	classId: uuid('class_id').notNull().references(() => classTable.id, {onDelete: 'cascade', onUpdate: 'cascade'})
},
(t) => ({
	pk: primaryKey({ columns: [t.studentId, t.classId] })
}),
);

// Relations //

// User Relations
export const userRelations = relations(userTable, ({ many }) => ({
	schools: many(userToSchool),
	classes: many(userToClass)
}));

// Student Relations
export const studentRelations = relations(studentTable, ({ many, one }) => ({
	classes: many(studentToClass),
	records: many(recordTable),
	school: one(schoolTable, { fields: [studentTable.schoolId], references: [schoolTable.id] })
}));

// Class Relations
export const classRelations = relations(classTable, ({ many, one }) => ({
	school: one(schoolTable, { fields: [classTable.schoolId], references: [schoolTable.id] }),
	students: many(studentToClass),
	users: many(userToClass)
}));

// School Relations
export const schoolRelations = relations(schoolTable, ({ many }) => ({
	students: many(studentTable),
	classes: many(classTable),
	users: many(userToSchool)
}));

// Record Relations
export const recordRelations = relations(recordTable, ({ one }) => ({
	student: one(studentTable, { fields: [recordTable.studentId], references: [studentTable.id] }),
	class: one(classTable, { fields: [recordTable.classId], references: [classTable.id] })
}));

// User to School Relations
export const userToSchoolRelations = relations(userToSchool, ({ one }) => ({
	user: one(userTable, { fields: [userToSchool.userId], references: [userTable.id] }),
	school: one(schoolTable, { fields: [userToSchool.schoolId], references: [schoolTable.id] })
}));

// User to Class Relations
export const userToClassRelations = relations(userToClass, ({ one }) => ({
	user: one(userTable, { fields: [userToClass.userId], references: [userTable.id] }),
	class: one(classTable, { fields: [userToClass.classId], references: [classTable.id] })
}));

// Student to Class Relations
export const studentToClassRelations = relations(studentToClass, ({ one }) => ({
	student: one(studentTable, { fields: [studentToClass.studentId], references: [studentTable.id] }),
	class: one(classTable, { fields: [studentToClass.classId], references: [classTable.id] })
}));

// Export Types
export type User = typeof userTable.$inferInsert;
export type UpdateUser = Partial<typeof userTable.$inferInsert>;
export type Student = typeof studentTable.$inferInsert;
export type Class = typeof classTable.$inferInsert;
export type School = typeof schoolTable.$inferInsert;
export type Record = typeof recordTable.$inferInsert;
export type UserToSchool = typeof userToSchool.$inferInsert;
export type UserToClass = typeof userToClass.$inferInsert;
export type StudentToClass = typeof studentToClass.$inferInsert;
export type UpdateStudent = Partial<typeof studentTable.$inferInsert>;
export type UpdateClass = Partial<typeof classTable.$inferInsert>;
export type UpdateSchool = Partial<typeof schoolTable.$inferInsert>;
export type UpdateRecord = Partial<typeof recordTable.$inferInsert>;
export type UpdateUserToSchool = Partial<typeof userToSchool.$inferInsert>;
export type UpdateUserToClass = Partial<typeof userToClass.$inferInsert>;
export type UpdateStudentToClass = Partial<typeof studentToClass.$inferInsert>;
export type Session = typeof sessionTable.$inferInsert;