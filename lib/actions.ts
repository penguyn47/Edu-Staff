"use server";

import { success } from "zod/v4";
import { facultySchema, FacultySchema, programSchema, ProgramSchema, studentSchema, StudentSchema, StudentStatusSchema, studentStatusSchema } from "./formValidationSchemas";

import prisma from "./prisma";
import { StudentStatus } from "@prisma/client";

type CurrentState = {
    success: boolean,
    error: boolean,
}

// ---------------------------------------------
//              STUDENTS
// ---------------------------------------------
export const createStudent = async (currentState: CurrentState, formData : FormData) => {
    const studentFormData : StudentSchema | any = Object.fromEntries(formData);
    const validatedStudentFormData = studentSchema.safeParse(studentFormData);
    try {
            if (!validatedStudentFormData.success) {
                const formFieldErrors = validatedStudentFormData.error.flatten().fieldErrors;
                console.log(studentFormData)
                return {
                    success: false,
                    error: true,
                    errors: {
                        studentId: formFieldErrors?.studentId?.[0],
                        name: formFieldErrors?.name?.[0],
                        dob: formFieldErrors?.dob?.[0],
                        sex: formFieldErrors?.sex?.[0],
                        faculty: formFieldErrors?.facultyId?.[0],
                        cohort: formFieldErrors?.cohort?.[0],
                        program: formFieldErrors?.programId?.[0],
                        address: formFieldErrors?.address?.[0],
                        phone: formFieldErrors?.phone?.[0],
                        email: formFieldErrors?.email?.[0],
                        status: formFieldErrors?.statusId?.[0],
                    },
                    data: studentFormData,
                };
            }

            const refinedData = {
                ...validatedStudentFormData.data,
                dob: new Date(validatedStudentFormData.data.dob),
                programId: parseInt(validatedStudentFormData.data.programId),
                facultyId: parseInt(validatedStudentFormData.data.facultyId),
                statusId: parseInt(validatedStudentFormData.data.statusId),
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
                        faculty: formFieldErrors?.facultyId?.[0],
                        cohort: formFieldErrors?.cohort?.[0],
                        program: formFieldErrors?.programId?.[0],
                        address: formFieldErrors?.address?.[0],
                        phone: formFieldErrors?.phone?.[0],
                        email: formFieldErrors?.email?.[0],
                        status: formFieldErrors?.statusId?.[0],
                    },
                    data: studentFormData,
                };
            }

            const refinedData = {
                ...validatedStudentFormData.data,
                dob: new Date(validatedStudentFormData.data.dob),
                programId: parseInt(validatedStudentFormData.data.programId),
                facultyId: parseInt(validatedStudentFormData.data.facultyId),
                statusId: parseInt(validatedStudentFormData.data.statusId),
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

// ---------------------------------------------
//              FACULTIES
// ---------------------------------------------
export const createFaculty = async (currentState: CurrentState, formData : FormData) => {
    const facultyFormData : FacultySchema | any = Object.fromEntries(formData);
    const validatedFacultyFormData = facultySchema.safeParse(facultyFormData);
    try {
            if (!validatedFacultyFormData.success) {
                const formFieldErrors = validatedFacultyFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: facultyFormData,
                };
            }

            const refinedData = {
                name: validatedFacultyFormData.data.name,
            }

            await prisma.faculty.create({
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
                data: facultyFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: facultyFormData,
        }
    }
} 

export const updateFaculty = async (currentState: CurrentState, formData : FormData) => {
    const facultyFormData : FacultySchema | any = Object.fromEntries(formData);
    const validatedFacultyFormData = facultySchema.safeParse(facultyFormData);

    try {
            if (!validatedFacultyFormData.success) {
                const formFieldErrors = validatedFacultyFormData.error.flatten().fieldErrors;
                console.log(formFieldErrors)
                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: facultyFormData,
                };
            }

            await prisma.faculty.update({
                where: {
                    id: validatedFacultyFormData.data.id
                },
                data: validatedFacultyFormData.data,
            })
            
            return {
                success: true,
                error:false,
                errors: null,
                data: null,
            }
    }
    catch(err : any) {
        console.log(err)
        if(err.code == 'P2002') {
            const field = err.meta?.target?.[0] || 'unknown';
            return {
                success: false,
                error: true,
                errors: {
                    [field]: "Đã tồn tại",
                },
                data: facultyFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: facultyFormData,
        }
    }
} 

export const deleteFaculty = async (currentState: CurrentState, data : FormData) => {
    try {
            const id = data.get('id') as string;

            await prisma.faculty.delete({
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

// ---------------------------------------------
//              PROGRAMS
// ---------------------------------------------
export const createProgram = async (currentState: CurrentState, formData : FormData) => {
    const programFormData : ProgramSchema | any = Object.fromEntries(formData);
    const validatedProgramFormData = programSchema.safeParse(programFormData);
    try {
            if (!validatedProgramFormData.success) {
                const formFieldErrors = validatedProgramFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: programFormData,
                };
            }

            const refinedData = {
                name: validatedProgramFormData.data.name,
            }

            await prisma.program.create({
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
                data: programFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: programFormData,
        }
    }
} 

export const updateProgram = async (currentState: CurrentState, formData : FormData) => {
    const programFormData : ProgramSchema | any = Object.fromEntries(formData);
    const validatedProgramFormData = programSchema.safeParse(programFormData);
    try {
            if (!validatedProgramFormData.success) {
                const formFieldErrors = validatedProgramFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: programFormData,
                };
            }

            await prisma.program.update({
                where: {
                    id: validatedProgramFormData.data.id,
                },
                data: {
                    name: validatedProgramFormData.data.name
                },
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
                data: programFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: programFormData,
        }
    }
} 

export const deleteProgram = async (currentState: CurrentState, data : FormData) => {
    try {
            const id = data.get('id') as string;

            await prisma.program.delete({
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

// ---------------------------------------------
//              STUDENT STATUSES
// ---------------------------------------------
export const createStudentStatus = async (currentState: CurrentState, formData : FormData) => {
    const studentStatusFormData : StudentStatusSchema | any = Object.fromEntries(formData);
    const validatedStudentStatusFormData = studentStatusSchema.safeParse(studentStatusFormData);
    try {
            if (!validatedStudentStatusFormData.success) {
                const formFieldErrors = validatedStudentStatusFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: studentStatusFormData,
                };
            }

            const refinedData = {
                name: validatedStudentStatusFormData.data.name,
            }

            await prisma.studentStatus.create({
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
                data: studentStatusFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: studentStatusFormData,
        }
    }
} 

export const updateStudentStatus = async (currentState: CurrentState, formData : FormData) => {
    const studentStatusFormData : StudentStatusSchema | any = Object.fromEntries(formData);
    const validatedStudentStatusFormData = studentStatusSchema.safeParse(studentStatusFormData);
    try {
            if (!validatedStudentStatusFormData.success) {
                const formFieldErrors = validatedStudentStatusFormData.error.flatten().fieldErrors;

                return {
                    success: false,
                    error: true,
                    errors: {
                        name: formFieldErrors?.name?.[0]
                    },
                    data: studentStatusFormData,
                };
            }

            await prisma.studentStatus.update({
                where: {
                    id: validatedStudentStatusFormData.data.id,
                },
                data: {
                    name: validatedStudentStatusFormData.data.name
                },
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
                data: studentStatusFormData,
            }
        }
        return {
            success: false,
            error: true,
            errors: null,
            data: studentStatusFormData,
        }
    }
} 

export const deleteStudentStatus = async (currentState: CurrentState, data : FormData) => {
    try {
            const id = data.get('id') as string;

            await prisma.studentStatus.delete({
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