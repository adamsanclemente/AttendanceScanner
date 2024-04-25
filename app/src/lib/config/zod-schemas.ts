import { z } from 'zod';

export const userSchema = z.object({
	firstName: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	lastName: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	password: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	confirmPassword: z
		.string({ required_error: 'Password is required' })
		.min(6, { message: 'Password must be at least 6 characters' })
		.trim(),
	//terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
	role: z
		.enum(['USER', 'PREMIUM', 'ADMIN'], { required_error: 'You must have a role' })
		.default('USER'),
	verified: z.boolean().default(false),
	terms: z.literal<boolean>(true, {
		errorMap: () => ({ message: "You must accept the terms & privacy policy" }),
	}),
	token: z.string().optional(),
	receiveEmail: z.boolean().default(true),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional()
});

export type UserSchema = typeof userSchema;

export const userUpdatePasswordSchema = userSchema
	.pick({ password: true, confirmPassword: true })
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['password']
			});
			ctx.addIssue({
				code: 'custom',
				message: 'Password and Confirm Password must match',
				path: ['confirmPassword']
			});
		}
	});

export type UserUpdatePasswordSchema = typeof userUpdatePasswordSchema;

export const createSchoolSchema = z.object({
	school_name: z
		.string({ required_error: 'School Name is required' })
		.min(1, { message: 'School Name is required' })
		.trim(),
	description: z
		.string()
		.optional(),
});

export type CreateSchoolSchema = typeof createSchoolSchema;

export const createClassSchema = z.object({
	class_name: z
		.string({ required_error: 'Class Name is required' })
		.min(1, { message: 'Class Name is required' })
		.trim(),
	description: z
		.string()
		.optional(),
});

export type CreateClassSchema = typeof createClassSchema;

export const createStudentSchema = z.object({
	first_name: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	grad_year: z
		.string({ required_error: 'Graduation Year is required' })
		.min(4, { message: 'Graduation Year is required' })
		.trim(),
	school_id: z.string({ required_error: 'School ID is required'}),
});

export type CreateStudentSchema = typeof createStudentSchema;

export const updateStudentSchema = z.object({
	first_name: z
		.string({ required_error: 'First Name is required' })
		.min(1, { message: 'First Name is required' })
		.trim(),
	last_name: z
		.string({ required_error: 'Last Name is required' })
		.min(1, { message: 'Last Name is required' })
		.trim(),
	email: z
		.string({ required_error: 'Email is required' })
		.email({ message: 'Please enter a valid email address' }),
	grad_year: z
		.string({ required_error: 'Graduation Year is required' })
		.min(4, { message: 'Graduation Year is required' })
		.trim(),
	school_id: z.string({ required_error: 'School ID is required'}),
});

export type UpdateStudentSchema = typeof updateStudentSchema;

export const deleteStudentSchema = z.object({
	confirm: z
		.string({ required_error: 'Confirmation is required' })
		.refinement((confirm) => confirm === 'DELETE', {
			message: 'Confirmation must be "DELETE"',
			code: 'custom'
		}),
});

export const editSchoolSchema = z.object({
	school_name: z
		.string({ required_error: 'School Name is required' })
		.min(1, { message: 'School Name is required' })
		.trim(),
	description: z
		.string()
		.optional(),
});

export type EditSchoolSchema = typeof editSchoolSchema;

export const manualAttendanceSchema = z.object({
	student_id: z.string({ required_error: 'Student ID is required' }),
	status: z.enum(['PRESENT', 'ABSENT', 'TARDY', 'COOP'], { required_error: 'Status is required' }),
	reason: z.string().optional(),
});

export type ManualAttendanceSchema = typeof manualAttendanceSchema;

export const updateStudentsToClassSchema = z.object({
	students: z.string().array()
});

export type UpdateStudentsToClassSchema = typeof updateStudentsToClassSchema;

export const updateClassSettingsSchema = z.object({
	name: z.string({ required_error: 'Class Name is required' })
		.min(1, { message: 'Class Name is required' })
		.trim(),
	description: z.string().trim().nullable().optional(),
	email_enable: z.enum(["true", "false"]),
	email_time: z.string(),
	users: z.string().array(),
	users_roles: z.enum(["TEACHER", "ADMIN"]).array(),
});

export type UpdateClassSettingsSchema = typeof updateClassSettingsSchema;