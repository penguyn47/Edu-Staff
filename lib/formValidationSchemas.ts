import { z } from "zod";

export const studentSchema = z.object({
    studentId: z.string().min(1, {message: "Yêu cầu mã số sinh viên"}),
    name: z.string().min(1, {message: "Họ tên không được bỏ trống"}),
    dob: z.string().refine((val) => /^\d{4}-\d{2}-\d{2}$/.test(val),{ message: "Ngày sinh không được bỏ trống"}),
    sex: z.enum(["MALE", "FEMALE"], {message: "Giới tính không được bỏ trống"}),
    faculty: z.string().min(1, {message: "Khoa không được bỏ trống"}),
    cohort: z.coerce.number().min(1, {message: "Niên khóa không được bỏ trống"}),
    program: z.string().min(1, {message: "Chương trình không được bỏ trống"}),
    address: z.string().optional(),
    phone: z.string(),
    email: z.string().optional(),
    status: z.enum(["ACTIVE", "GRADUATED", "SUSPENDED", "WITHDRAWN"], {message: "Trạng thái không được bỏ trống"}),
})

export type StudentSchema = z.infer<typeof studentSchema>;