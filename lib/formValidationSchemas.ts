import { z } from 'zod'

import { ALLOWED_EMAIL_DOMAINS, ALLOWED_PHONE_FORMAT } from './settings'

export const studentSchema = z.object({
	studentId: z.string().min(1, { message: 'Yêu cầu mã số sinh viên' }),
	name: z.string().min(1, { message: 'Họ tên không được bỏ trống' }),
	dob: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Ngày sinh không được bỏ trống' }),
	sex: z.enum(['MALE', 'FEMALE'], { message: 'Giới tính không được bỏ trống' }),
	facultyId: z.number().positive({ message: 'Khoa không được bỏ trống' }),
	cohort: z.number().positive({ message: 'Niên khóa không được bỏ trống' }),
	programId: z.number().positive({ message: 'Chương trình không được bỏ trống' }),
	phone: z.string().trim().regex(ALLOWED_PHONE_FORMAT, {
		message: 'Số điện thoại không hợp lệ',
	}),
	email: z
		.string()
		.email({ message: 'Email không hợp lệ' })
		.refine((value) => value.endsWith(ALLOWED_EMAIL_DOMAINS), {
			message: `Email phải có đuôi ${ALLOWED_EMAIL_DOMAINS}`,
		}),
	statusId: z.number().positive({ message: 'Trạng thái không được bỏ trống' }),
	permaAddressId: z.number().optional(),
	tempAddressId: z.number().optional(),
	cmndId: z.number().optional(),
	cccdId: z.number().optional(),
	passportId: z.number().optional(),
	nationality: z.string().min(1, { message: 'Quốc tịch không được bỏ trống' }),
})

export const addressSchema = z.object({
	houseNumber: z.string().min(1, { message: 'Số nhà không được bỏ trống' }),
	street: z.string().min(1, { message: 'Đường không được bỏ trống' }),
	ward: z.string().min(1, { message: 'Phường/Xã không được bỏ trống' }),
	district: z.string().min(1, { message: 'Quận/Huyện không được bỏ trống' }),
	city: z.string().min(1, { message: 'Thành phố/Tỉnh không được bỏ trống' }),
	country: z.string().min(1, { message: 'Quốc gia không được bỏ trống' }),
})

export const identificationSchema = z.object({
	number: z.string().min(1, { message: 'Số giấy tờ không được bỏ trống' }),
	issueDate: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Ngày cấp không được bỏ trống' }),
	expiryDate: z
		.string()
		.refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val), { message: 'Ngày hết hạn không được bỏ trống' }),
	issuePlace: z.string().min(1, { message: 'Nơi cấp không được bỏ trống' }),
	hasChip: z.boolean().optional(),
	issuingCountry: z.string().optional(),
	notes: z.string().optional(),
})

export const facultySchema = z.object({
	id: z.coerce.number(),
	name: z.string().min(1, { message: 'Tên khoa không được bỏ trống' }),
})

export const programSchema = z.object({
	id: z.coerce.number(),
	name: z.string().min(1, { message: 'Tên chương trình không được bỏ trống' }),
})

export const studentStatusSchema = z.object({
	id: z.coerce.number(),
	name: z.string().min(1, { message: 'Tên trạng thái sinh viên không được bỏ trống' }),
})

export const teacherSchema = z.object({
	name: z.string().min(1, { message: 'Tên giảng viên không được bỏ trống' }),
	teacherId: z.string().min(1, { message: 'Mã giảng viên không được bỏ trống' }),
})

export const courseSchema = z.object({
	courseId: z.string().min(1, { message: 'Mã khóa học không được bỏ trống' }),
	name: z.string().min(1, { message: 'Tên khóa học không được bỏ trống' }),
	credits: z.coerce.number().min(2, { message: 'Số tín chỉ phải >= 2' }),
	description: z.string().min(1, { message: 'Mô tả khóa học không được bỏ trống' }),
	facultyId: z.string().min(1, { message: 'Khoa phụ trách không được để trống' }),
	preCourseId: z.string(),
})

export type StudentSchema = z.infer<typeof studentSchema>
export type FacultySchema = z.infer<typeof facultySchema>
export type ProgramSchema = z.infer<typeof programSchema>
export type StudentStatusSchema = z.infer<typeof studentStatusSchema>
export type AddressSchema = z.infer<typeof addressSchema>
export type TeacherSchema = z.infer<typeof teacherSchema>
export type CourseSchema = z.infer<typeof courseSchema>
