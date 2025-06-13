import { z } from "zod";

export const studentSchema = z.object({
    studentId: z.string().min(1, {message: "Yêu cầu mã số sinh viên"}),
    name: z.string().min(1, {message: "Họ tên không được bỏ trống"}),
    dob: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val),{ message: "Ngày sinh không được bỏ trống"}),
    sex: z.enum(["MALE", "FEMALE"], {message: "Giới tính không được bỏ trống"}),
    facultyId: z.string().min(1, {message: "Khoa không được bỏ trống"}),
    cohort: z.coerce.number().min(1, {message: "Niên khóa không được bỏ trống"}),
    programId: z.string().min(1, {message: "Chương trình không được bỏ trống"}),
    address: z.string().optional(),
    phone: z.string(),
    email: z.string().optional(),
    statusId: z.string().min(1,{message: "Trạng thái không được bỏ trống"}),
})

export const facultySchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, {message: "Tên khoa không được bỏ trống"})
})

export const programSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, {message: "Tên chương trình không được bỏ trống"})
})

export const studentStatusSchema = z.object({
    id: z.coerce.number(),
    name: z.string().min(1, {message: "Tên trạng thái sinh viên không được bỏ trống"})
})

export type StudentSchema = z.infer<typeof studentSchema>;
export type FacultySchema = z.infer<typeof facultySchema>;
export type ProgramSchema = z.infer<typeof programSchema>;
export type StudentStatusSchema = z.infer<typeof studentStatusSchema>;