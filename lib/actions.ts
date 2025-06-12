"use server";

import { success } from "zod/v4";
import { studentSchema, StudentSchema } from "./formValidationSchemas";

import prisma from "./prisma";

type CurrentState = {
    success: boolean,
    error: boolean,
}

export const createStudent = async (currentState: CurrentState, formData : FormData) => {
    const studentFormData : StudentSchema | any = Object.fromEntries(formData);
    const validatedStudentFormData = studentSchema.safeParse(studentFormData);
    try {
            if (!validatedStudentFormData.success) {
                const formFieldErrors = validatedStudentFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        studentId: formFieldErrors?.studentId?.[0],
                        name: formFieldErrors?.name?.[0],
                        dob: formFieldErrors?.dob?.[0],
                        sex: formFieldErrors?.sex?.[0],
                        faculty: formFieldErrors?.faculty?.[0],
                        cohort: formFieldErrors?.cohort?.[0],
                        program: formFieldErrors?.program?.[0],
                        address: formFieldErrors?.address?.[0],
                        phone: formFieldErrors?.phone?.[0],
                        email: formFieldErrors?.email?.[0],
                        status: formFieldErrors?.status?.[0],
                    },
                    data: studentFormData,
                };
            }

            const refinedData = {
                ...validatedStudentFormData.data,
                dob: new Date(validatedStudentFormData.data.dob)
            }

            await prisma.student.create({
                data: refinedData,
            })

            return {
                success: true,
                error:false,
                errors: null,
                data: null,
            }
    }
    catch(err : any) {
        if(err.code == 'P2002') {
            const field = err.meta?.target?.[0] || 'unknown';
            return {
                success: false,
                error: true,
                errors: {
                    [field]: "Đã tồn tại",
                },
                data: studentFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: studentFormData,
        }
    }
} 

export const deleteStudent = async (currentState: CurrentState, data : FormData) => {
    try {
            const id = data.get('id') as string;

            await prisma.student.delete({
                where: {
                    id: parseInt(id),
                }
            })

            return {
                success: true,
                error:false,
            }
    }
    catch(err : any) {
        console.log(err);
        return {
                success: true,
                error:false,
            }
    }
} 

export const updateStudent = async (currentState: CurrentState, formData : FormData) => {
    const studentFormData : StudentSchema | any = Object.fromEntries(formData);
    const validatedStudentFormData = studentSchema.safeParse(studentFormData);
    try {
            if (!validatedStudentFormData.success) {
                const formFieldErrors = validatedStudentFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        studentId: formFieldErrors?.studentId?.[0],
                        name: formFieldErrors?.name?.[0],
                        dob: formFieldErrors?.dob?.[0],
                        sex: formFieldErrors?.sex?.[0],
                        faculty: formFieldErrors?.faculty?.[0],
                        cohort: formFieldErrors?.cohort?.[0],
                        program: formFieldErrors?.program?.[0],
                        address: formFieldErrors?.address?.[0],
                        phone: formFieldErrors?.phone?.[0],
                        email: formFieldErrors?.email?.[0],
                        status: formFieldErrors?.status?.[0],
                    },
                    data: studentFormData,
                };
            }

            const refinedData = {
                ...validatedStudentFormData.data,
                dob: new Date(validatedStudentFormData.data.dob)
            }

            await prisma.student.update({
                where: {
                    studentId: refinedData.studentId,
                },
                data: refinedData
            })

            return {
                success: true,
                error:false,
                errors: null,
                data: null,
            }
    }
    catch(err : any) {
        if(err.code == 'P2002') {
            const field = err.meta?.target?.[0] || 'unknown';
            return {
                success: false,
                error: true,
                errors: {
                    [field]: "Đã tồn tại",
                },
                data: studentFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: studentFormData,
        }
    }
} 