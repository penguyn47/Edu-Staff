'use server'
import { Workbook } from 'exceljs'
import * as XLSX from 'xlsx'

import {
	addressSchema,
	courseSchema,
	CourseSchema,
	facultySchema,
	FacultySchema,
	identificationSchema,
	programSchema,
	ProgramSchema,
	studentSchema,
	StudentSchema,
	StudentStatusSchema,
	studentStatusSchema,
	teacherSchema,
	TeacherSchema,
} from './formValidationSchemas'

import prisma from './prisma'
import { logger } from '@/services/logger'

type CurrentState = {
	success: boolean
	error: boolean
}

// ---------------------------------------------
//              STUDENTS
// ---------------------------------------------
export const createStudent = async (currentState: CurrentState, formData: FormData) => {
	const allFormData: StudentSchema | any = Object.fromEntries(formData)

	const result: {
		success: boolean
		error: boolean
		errors: any
		data: any
	} = {
		success: false,
		error: false,
		errors: {},
		data: allFormData,
	}

	logger.debug(`[server-actions]: (Create-Student): Received form data. (DEBUG-END). [${JSON.stringify(allFormData)}]`)

	logger.info('[server-actions]: (Create-Student): Started. (INFO-END). []')

	const studentFormData = {
		studentId: allFormData.studentId,
		name: allFormData.name,
		dob: allFormData.dob,
		sex: allFormData.sex,
		phone: allFormData.phone,
		email: allFormData.email,
		zipCode: parseInt(allFormData.zipCode),
		cohort: allFormData.cohort ? parseInt(allFormData.cohort) : -1,
		facultyId: allFormData.facultyId ? parseInt(allFormData.facultyId) : -1,
		programId: allFormData.programId ? parseInt(allFormData.programId) : -1,
		statusId: allFormData.statusId ? parseInt(allFormData.statusId) : -1,

		permaAddressId: parseInt(allFormData.permaAddressId) || undefined,
		tempAddressId: parseInt(allFormData.tempAddressId) || undefined,

		cmndId: parseInt(allFormData.cmndId) || undefined,
		cccdId: parseInt(allFormData.cccdId) || undefined,
		passportId: parseInt(allFormData.passportId) || undefined,
		nationality: allFormData.nationality,
	}

	const permaAddressFormData = {
		houseNumber: allFormData.permaAddressHouseNumber,
		street: allFormData.permaAddressStreet,
		ward: allFormData.permaAddressWard,
		district: allFormData.permaAddressDistrict,
		city: allFormData.permaAddressCity,
		country: allFormData.permaAddressCountry,
	}

	const tempAddressFormData = {
		houseNumber: allFormData.tempAddressHouseNumber,
		street: allFormData.tempAddressStreet,
		ward: allFormData.tempAddressWard,
		district: allFormData.permaAddressDistrict,
		city: allFormData.tempAddressCity,
		country: allFormData.tempAddressCountry,
	}

	const cccdFormData = {
		number: allFormData.cccdNumber,
		issueDate: allFormData.cccdIssueDate,
		expiryDate: allFormData.cccdExpiryDate,
		issuePlace: allFormData.cccdIssuePlace,
		hasChip: allFormData?.cccdHasChip == 'on' ? true : false,
	}

	const cmndFormData = {
		number: allFormData.cmndNumber,
		issueDate: allFormData.cmndIssueDate,
		expiryDate: allFormData.cmndExpiryDate,
		issuePlace: allFormData.cmndIssuePlace,
	}

	const passportFormData = {
		number: allFormData.passportNumber,
		issueDate: allFormData.passportIssueDate,
		expiryDate: allFormData.passportExpiryDate,
		issuePlace: allFormData.passportIssuePlace,
		issuingCountry: allFormData.passportIssuingCountry,
		notes: allFormData.passportNotes,
	}

	logger.debug(
		`[server-actions]: (Create-Student): Parsed CCCD form data. (DEBUG-END). [${JSON.stringify(cccdFormData)}]`,
	)

	const validatedStudentFormData = studentSchema.safeParse(studentFormData)
	const validatedPermaAddressFormData = addressSchema.safeParse(permaAddressFormData)
	const validatedTempAddressFormData = addressSchema.safeParse(tempAddressFormData)

	const validatedcmndFormData = identificationSchema.safeParse(cmndFormData)
	const validatedcccdFormData = identificationSchema.safeParse(cccdFormData)
	const validatedpassportFormData = identificationSchema.safeParse(passportFormData)

	const isValidationSuccess =
		true &&
		validatedStudentFormData.success &&
		(validatedPermaAddressFormData.success || !allFormData.includePermaAddress) &&
		(validatedTempAddressFormData.success || !allFormData.includeTempAddress) &&
		(validatedcmndFormData.success || !allFormData.includecmnd) &&
		(validatedcccdFormData.success || !allFormData.includecccd) &&
		(validatedpassportFormData.success || !allFormData.includepassport)

	try {
		if (!isValidationSuccess) {
			logger.error(`[server-actions]: (Create-Student): Form validation failed. (ERROR-END). [Validation errors]`)

			if (!validatedStudentFormData.success) {
				const formFieldErrors = validatedStudentFormData.error.flatten().fieldErrors
				logger.error(
					`[server-actions]: (Create-Student): Student validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
				)
				result.errors = {
					...result.errors,
					studentId: formFieldErrors?.studentId?.[0],
					name: formFieldErrors?.name?.[0],
					dob: formFieldErrors?.dob?.[0],
					sex: formFieldErrors?.sex?.[0],
					faculty: formFieldErrors?.facultyId?.[0],
					cohort: formFieldErrors?.cohort?.[0],
					program: formFieldErrors?.programId?.[0],
					phone: formFieldErrors?.phone?.[0],
					email: formFieldErrors?.email?.[0],
					status: formFieldErrors?.statusId?.[0],
				}
			}

			if (allFormData.includePermaAddress) {
				if (!validatedPermaAddressFormData.success) {
					const permaAddressformFieldErrors = validatedPermaAddressFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Create-Student): Permanent address validation failed. (ERROR-END). [${JSON.stringify(permaAddressformFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						permaAddressHouseNumber: permaAddressformFieldErrors?.houseNumber?.[0],
						permaAddressStreet: permaAddressformFieldErrors?.street?.[0],
						permaAddressWard: permaAddressformFieldErrors?.ward?.[0],
						permaAddressDistrict: permaAddressformFieldErrors?.district?.[0],
						permaAddressCity: permaAddressformFieldErrors?.city?.[0],
						permaAddressCountry: permaAddressformFieldErrors?.country?.[0],
					}
				}
			}

			if (allFormData.includeTempAddress) {
				if (!validatedTempAddressFormData.success) {
					const tempAddressformFieldErrors = validatedTempAddressFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Create-Student): Temporary address validation failed. (ERROR-END). [${JSON.stringify(tempAddressformFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						tempAddressHouseNumber: tempAddressformFieldErrors?.houseNumber?.[0],
						tempAddressStreet: tempAddressformFieldErrors?.street?.[0],
						tempAddressWard: tempAddressformFieldErrors?.ward?.[0],
						tempAddressDistrict: tempAddressformFieldErrors?.district?.[0],
						tempAddressCity: tempAddressformFieldErrors?.city?.[0],
						tempAddressCountry: tempAddressformFieldErrors?.country?.[0],
					}
				}
			}

			if (allFormData.includecmnd) {
				if (!validatedcmndFormData.success) {
					const cmndFormFieldErrors = validatedcmndFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Create-Student): CMND validation failed. (ERROR-END). [${JSON.stringify(cmndFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						cmndNumber: cmndFormFieldErrors?.number?.[0],
						cmndIssueDate: cmndFormFieldErrors?.issueDate?.[0],
						cmndExpiryDate: cmndFormFieldErrors?.expiryDate?.[0],
						cmndIssuePlace: cmndFormFieldErrors?.issuePlace?.[0],
					}
				}
			}

			if (allFormData.includecccd) {
				if (!validatedcccdFormData.success) {
					const cccdFormFieldErrors = validatedcccdFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Create-Student): CCCD validation failed. (ERROR-END). [${JSON.stringify(cccdFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						cccdNumber: cccdFormFieldErrors?.number?.[0],
						cccdIssueDate: cccdFormFieldErrors?.issueDate?.[0],
						cccdExpiryDate: cccdFormFieldErrors?.expiryDate?.[0],
						cccdIssuePlace: cccdFormFieldErrors?.issuePlace?.[0],
						cccdHasChip: cccdFormFieldErrors?.hasChip?.[0],
					}
				}
			}

			if (allFormData.includepassport) {
				if (!validatedpassportFormData.success) {
					const passportFormFieldErrors = validatedpassportFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Create-Student): Passport validation failed. (ERROR-END). [${JSON.stringify(passportFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						passportNumber: passportFormFieldErrors?.number?.[0],
						passportIssueDate: passportFormFieldErrors?.issueDate?.[0],
						passportExpiryDate: passportFormFieldErrors?.expiryDate?.[0],
						passportIssuePlace: passportFormFieldErrors?.issuePlace?.[0],
						passportIssuingCountry: passportFormFieldErrors?.issuingCountry?.[0],
						passportNotes: passportFormFieldErrors?.notes?.[0],
					}
				}
			}

			result.error = true
			return result
		}

		logger.info(`[server-actions]: (Create-Student): Form validation succeeded. (INFO-END). []`)

		let permaAddressId: number = 0
		let tempAddressId: number = 0

		let cmndId: number = 0
		let cccdId: number = 0
		let passportId: number = 0

		if (allFormData.includePermaAddress) {
			const permaAddr = await prisma.address.create({
				data: permaAddressFormData,
			})
			permaAddressId = permaAddr.id
			logger.info(
				`[server-actions]: (Create-Student): Created new permanent address. (INFO-END). [ID: ${permaAddressId}]`,
			)
		}

		if (allFormData.includeTempAddress) {
			const tempAddr = await prisma.address.create({
				data: tempAddressFormData,
			})
			tempAddressId = tempAddr.id
			logger.info(
				`[server-actions]: (Create-Student): Created new temporary address. (INFO-END). [ID: ${tempAddressId}]`,
			)
		}

		if (allFormData.includecmnd) {
			const cmnd = await prisma.identification.create({
				data: {
					...cmndFormData,
					issueDate: new Date(cmndFormData.issueDate),
					expiryDate: new Date(cmndFormData.expiryDate),
					type: 'CMND',
				},
			})
			cmndId = cmnd.id
			logger.info(`[server-actions]: (Create-Student): Created new CMND. (INFO-END). [ID: ${cmndId}]`)
		}

		if (allFormData.includecccd) {
			const cccd = await prisma.identification.create({
				data: {
					...cccdFormData,
					issueDate: new Date(cccdFormData.issueDate),
					expiryDate: new Date(cccdFormData.expiryDate),
					type: 'CCCD',
				},
			})
			cccdId = cccd.id
			logger.info(`[server-actions]: (Create-Student): Created new CCCD. (INFO-END). [ID: ${cccdId}]`)
		}

		if (allFormData.includepassport) {
			const passport = await prisma.identification.create({
				data: {
					...passportFormData,
					issueDate: new Date(passportFormData.issueDate),
					expiryDate: new Date(passportFormData.expiryDate),
					type: 'PASSPORT',
				},
			})
			passportId = passport.id
			logger.info(`[server-actions]: (Create-Student): Created new passport. (INFO-END). [ID: ${passportId}]`)
		}

		await prisma.student.create({
			data: {
				...studentFormData,
				dob: new Date(studentFormData.dob),
				facultyId: studentFormData.facultyId,
				programId: studentFormData.programId,
				statusId: studentFormData.statusId,

				permaAddressId: permaAddressId || null,
				tempAddressId: tempAddressId || null,

				cmndId: cmndId || null,
				cccdId: cccdId || null,
				passportId: passportId || null,
			},
		})

		logger.info(
			`[server-actions]: (Create-Student): Student created successfully. (INFO-END). [StudentID: ${studentFormData.studentId}]`,
		)

		result.success = true
		result.error = false

		return result
	} catch (err: any) {
		logger.error(`[server-actions]: (Create-Student): Error. (ERROR-END). [${err.message}]`)

		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-Student): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: allFormData,
			}
		}
		return {
			success: false,
			error: true,
			errors: null,
			data: allFormData,
		}
	}
}

export const deleteStudent = async (currentState: CurrentState, data: FormData) => {
	try {
		logger.info(`[server-actions]: (Delete-Student): Started. (INFO-END). []`)
		const id = data.get('id') as string
		logger.debug(`[server-actions]: (Delete-Student): Received form data. (DEBUG-END). [ID: ${id}]`)

		const student = await prisma.student.findUnique({
			where: {
				id: parseInt(id),
			},
		})

		if (student?.permaAddressId) {
			await prisma.address.delete({
				where: {
					id: student?.permaAddressId,
				},
			})
			logger.info(
				`[server-actions]: (Delete-Student): Deleted permanent address. (INFO-END). [ID: ${student?.permaAddressId}]`,
			)
		}

		if (student?.tempAddressId) {
			await prisma.address.delete({
				where: {
					id: student?.tempAddressId,
				},
			})
			logger.info(
				`[server-actions]: (Delete-Student): Deleted temporary address. (INFO-END). [ID: ${student?.tempAddressId}]`,
			)
		}

		if (student?.cmndId) {
			await prisma.identification.delete({
				where: {
					id: student?.cmndId,
				},
			})
			logger.info(`[server-actions]: (Delete-Student): Deleted CMND. (INFO-END). [ID: ${student?.cmndId}]`)
		}

		if (student?.cccdId) {
			await prisma.identification.delete({
				where: {
					id: student?.cccdId,
				},
			})
			logger.info(`[server-actions]: (Delete-Student): Deleted CCCD. (INFO-END). [ID: ${student?.cccdId}]`)
		}

		if (student?.passportId) {
			await prisma.identification.delete({
				where: {
					id: student?.passportId,
				},
			})
			logger.info(`[server-actions]: (Delete-Student): Deleted passport. (INFO-END). [ID: ${student?.passportId}]`)
		}

		await prisma.student.delete({
			where: {
				id: parseInt(id),
			},
		})
		logger.info(`[server-actions]: (Delete-Student): Student deleted successfully. (INFO-END). [ID: ${id}]`)

		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-Student): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}

export const updateStudent = async (currentState: CurrentState, formData: FormData) => {
	const parsedFormData: StudentSchema | any = Object.fromEntries(formData)

	const allFormData = {
		...parsedFormData,
		permaAddressId: parseInt(parsedFormData.permaAddressId) || null,
		tempAddressId: parseInt(parsedFormData.tempAddressId) || null,
		cmndId: parseInt(parsedFormData.cmndId) || null,
		cccdId: parseInt(parsedFormData.cccdId) || null,
		passportId: parseInt(parsedFormData.passportId) || null,
	}

	logger.debug(`[server-actions]: (Update-Student): Received form data. (DEBUG-END). [${JSON.stringify(allFormData)}]`)
	logger.info(`[server-actions]: (Update-Student): Started. (INFO-END). []`)

	const result: {
		success: boolean
		error: boolean
		errors: any
		data: any
	} = {
		success: false,
		error: false,
		errors: {},
		data: allFormData,
	}

	const studentFormData = {
		studentId: allFormData.studentId,
		name: allFormData.name,
		dob: allFormData.dob,
		sex: allFormData.sex,
		phone: allFormData.phone,
		email: allFormData.email,
		zipCode: parseInt(allFormData.zipCode),
		cohort: allFormData.cohort ? parseInt(allFormData.cohort) : -1,
		facultyId: allFormData.facultyId ? parseInt(allFormData.facultyId) : -1,
		programId: allFormData.programId ? parseInt(allFormData.programId) : -1,
		statusId: allFormData.statusId ? parseInt(allFormData.statusId) : -1,

		permaAddressId: parseInt(allFormData.permaAddressId) || undefined,
		tempAddressId: parseInt(allFormData.tempAddressId) || undefined,

		cmndId: parseInt(allFormData.cmndId) || undefined,
		cccdId: parseInt(allFormData.cccdId) || undefined,
		passportId: parseInt(allFormData.passportId) || undefined,
		nationality: allFormData.nationality,
	}

	const permaAddressFormData = {
		houseNumber: allFormData.permaAddressHouseNumber,
		street: allFormData.permaAddressStreet,
		ward: allFormData.permaAddressWard,
		district: allFormData.permaAddressDistrict,
		city: allFormData.permaAddressCity,
		country: allFormData.permaAddressCountry,
	}

	const tempAddressFormData = {
		houseNumber: allFormData.tempAddressHouseNumber,
		street: allFormData.tempAddressStreet,
		ward: allFormData.tempAddressWard,
		district: allFormData.permaAddressDistrict,
		city: allFormData.tempAddressCity,
		country: allFormData.tempAddressCountry,
	}

	const cccdFormData = {
		number: allFormData.cccdNumber,
		issueDate: allFormData.cccdIssueDate,
		expiryDate: allFormData.cccdExpiryDate,
		issuePlace: allFormData.cccdIssuePlace,
		hasChip: allFormData?.cccdHasChip == 'on' ? true : false,
	}

	const cmndFormData = {
		number: allFormData.cmndNumber,
		issueDate: allFormData.cmndIssueDate,
		expiryDate: allFormData.cmndExpiryDate,
		issuePlace: allFormData.cmndIssuePlace,
	}

	const passportFormData = {
		number: allFormData.passportNumber,
		issueDate: allFormData.passportIssueDate,
		expiryDate: allFormData.passportExpiryDate,
		issuePlace: allFormData.passportIssuePlace,
		issuingCountry: allFormData.passportIssuingCountry,
		notes: allFormData.passportNotes,
	}

	const validatedStudentFormData = studentSchema.safeParse(studentFormData)
	const validatedPermaAddressFormData = addressSchema.safeParse(permaAddressFormData)
	const validatedTempAddressFormData = addressSchema.safeParse(tempAddressFormData)

	const validatedcmndFormData = identificationSchema.safeParse(cmndFormData)
	const validatedcccdFormData = identificationSchema.safeParse(cccdFormData)
	const validatedpassportFormData = identificationSchema.safeParse(passportFormData)

	const isValidationSuccess =
		true &&
		validatedStudentFormData.success &&
		(validatedPermaAddressFormData.success || !allFormData.includePermaAddress) &&
		(validatedTempAddressFormData.success || !allFormData.includeTempAddress) &&
		(validatedcmndFormData.success || !allFormData.includecmnd) &&
		(validatedcccdFormData.success || !allFormData.includecccd) &&
		(validatedpassportFormData.success || !allFormData.includepassport)

	try {
		if (!isValidationSuccess) {
			logger.error(`[server-actions]: (Update-Student): Form validation failed. (ERROR-END). [Validation errors]`)

			if (!validatedStudentFormData.success) {
				const formFieldErrors = validatedStudentFormData.error.flatten().fieldErrors
				logger.error(
					`[server-actions]: (Update-Student): Student validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
				)
				result.errors = {
					...result.errors,
					studentId: formFieldErrors?.studentId?.[0],
					name: formFieldErrors?.name?.[0],
					dob: formFieldErrors?.dob?.[0],
					sex: formFieldErrors?.sex?.[0],
					faculty: formFieldErrors?.facultyId?.[0],
					cohort: formFieldErrors?.cohort?.[0],
					program: formFieldErrors?.programId?.[0],
					phone: formFieldErrors?.phone?.[0],
					email: formFieldErrors?.email?.[0],
					status: formFieldErrors?.statusId?.[0],
				}
			}

			if (allFormData.includePermaAddress) {
				if (!validatedPermaAddressFormData.success) {
					const permaAddressformFieldErrors = validatedPermaAddressFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Update-Student): Permanent address validation failed. (ERROR-END). [${JSON.stringify(permaAddressformFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						permaAddressHouseNumber: permaAddressformFieldErrors?.houseNumber?.[0],
						permaAddressStreet: permaAddressformFieldErrors?.street?.[0],
						permaAddressWard: permaAddressformFieldErrors?.ward?.[0],
						permaAddressDistrict: permaAddressformFieldErrors?.district?.[0],
						permaAddressCity: permaAddressformFieldErrors?.city?.[0],
						permaAddressCountry: permaAddressformFieldErrors?.country?.[0],
					}
				}
			}

			if (allFormData.includeTempAddress) {
				if (!validatedTempAddressFormData.success) {
					const tempAddressformFieldErrors = validatedTempAddressFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Update-Student): Temporary address validation failed. (ERROR-END). [${JSON.stringify(tempAddressformFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						tempAddressHouseNumber: tempAddressformFieldErrors?.houseNumber?.[0],
						tempAddressStreet: tempAddressformFieldErrors?.street?.[0],
						tempAddressWard: tempAddressformFieldErrors?.ward?.[0],
						tempAddressDistrict: tempAddressformFieldErrors?.district?.[0],
						tempAddressCity: tempAddressformFieldErrors?.city?.[0],
						tempAddressCountry: tempAddressformFieldErrors?.country?.[0],
					}
				}
			}

			if (allFormData.includecmnd) {
				if (!validatedcmndFormData.success) {
					const cmndFormFieldErrors = validatedcmndFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Update-Student): CMND validation failed. (ERROR-END). [${JSON.stringify(cmndFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						cmndNumber: cmndFormFieldErrors?.number?.[0],
						cmndIssueDate: cmndFormFieldErrors?.issueDate?.[0],
						cmndExpiryDate: cmndFormFieldErrors?.expiryDate?.[0],
						cmndIssuePlace: cmndFormFieldErrors?.issuePlace?.[0],
					}
				}
			}

			if (allFormData.includecccd) {
				if (!validatedcccdFormData.success) {
					const cccdFormFieldErrors = validatedcccdFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Update-Student): CCCD validation failed. (ERROR-END). [${JSON.stringify(cccdFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						cccdNumber: cccdFormFieldErrors?.number?.[0],
						cccdIssueDate: cccdFormFieldErrors?.issueDate?.[0],
						cccdExpiryDate: cccdFormFieldErrors?.expiryDate?.[0],
						cccdIssuePlace: cccdFormFieldErrors?.issuePlace?.[0],
						cccdHasChip: cccdFormFieldErrors?.hasChip?.[0],
					}
				}
			}

			if (allFormData.includepassport) {
				if (!validatedpassportFormData.success) {
					const passportFormFieldErrors = validatedpassportFormData.error.flatten().fieldErrors
					logger.error(
						`[server-actions]: (Update-Student): Passport validation failed. (ERROR-END). [${JSON.stringify(passportFormFieldErrors)}]`,
					)
					result.errors = {
						...result.errors,
						passportNumber: passportFormFieldErrors?.number?.[0],
						passportIssueDate: passportFormFieldErrors?.issueDate?.[0],
						passportExpiryDate: passportFormFieldErrors?.expiryDate?.[0],
						passportIssuePlace: passportFormFieldErrors?.issuePlace?.[0],
						passportIssuingCountry: passportFormFieldErrors?.issuingCountry?.[0],
						passportNotes: passportFormFieldErrors?.notes?.[0],
					}
				}
			}

			result.error = true
			return result
		}

		logger.info(`[server-actions]: (Update-Student): Form validation succeeded. (INFO-END). []`)

		let permaAddressId: number = 0
		let tempAddressId: number = 0

		let cmndId: number = 0
		let cccdId: number = 0
		let passportId: number = 0

		if (allFormData.includePermaAddress || allFormData.permaAddressId) {
			if (allFormData.permaAddressId) {
				await prisma.address.update({
					where: {
						id: allFormData.permaAddressId,
					},
					data: permaAddressFormData,
				})
				logger.info(
					`[server-actions]: (Update-Student): Updated permanent address. (INFO-END). [ID: ${allFormData.permaAddressId}]`,
				)
			} else {
				const permaAddr = await prisma.address.create({
					data: permaAddressFormData,
				})
				permaAddressId = permaAddr.id
				logger.info(
					`[server-actions]: (Update-Student): Created new permanent address. (INFO-END). [ID: ${permaAddressId}]`,
				)
			}
		}

		if (allFormData.includeTempAddress || allFormData.tempAddressId) {
			if (allFormData.tempAddressId) {
				await prisma.address.update({
					where: {
						id: allFormData.tempAddressId,
					},
					data: tempAddressFormData,
				})
				logger.info(
					`[server-actions]: (Update-Student): Updated temporary address. (INFO-END). [ID: ${allFormData.tempAddressId}]`,
				)
			} else {
				const tempAddr = await prisma.address.create({
					data: tempAddressFormData,
				})
				tempAddressId = tempAddr.id
				logger.info(
					`[server-actions]: (Update-Student): Created new temporary address. (INFO-END). [ID: ${tempAddressId}]`,
				)
			}
		}

		if (allFormData.includecmnd || allFormData.cmndId) {
			if (allFormData.cmndId) {
				await prisma.identification.update({
					where: {
						id: allFormData.cmndId,
					},
					data: {
						...cmndFormData,
						issueDate: new Date(cmndFormData.issueDate),
						expiryDate: new Date(cmndFormData.expiryDate),
						type: 'CMND',
					},
				})
				logger.info(`[server-actions]: (Update-Student): Updated CMND. (INFO-END). [ID: ${allFormData.cmndId}]`)
			} else {
				const cmnd = await prisma.identification.create({
					data: {
						...cmndFormData,
						issueDate: new Date(cmndFormData.issueDate),
						expiryDate: new Date(cmndFormData.expiryDate),
						type: 'CMND',
					},
				})
				cmndId = cmnd.id
				logger.info(`[server-actions]: (Update-Student): Created new CMND. (INFO-END). [ID: ${cmndId}]`)
			}
		}

		if (allFormData.includecccd || allFormData.cccdId) {
			if (allFormData.cccdId) {
				await prisma.identification.update({
					where: {
						id: allFormData.cccdId,
					},
					data: {
						...cccdFormData,
						issueDate: new Date(cccdFormData.issueDate),
						expiryDate: new Date(cccdFormData.expiryDate),
						type: 'CCCD',
					},
				})
				logger.info(`[server-actions]: (Update-Student): Updated CCCD. (INFO-END). [ID: ${allFormData.cccdId}]`)
			} else {
				const cccd = await prisma.identification.create({
					data: {
						...cccdFormData,
						issueDate: new Date(cccdFormData.issueDate),
						expiryDate: new Date(cccdFormData.expiryDate),
						type: 'CCCD',
					},
				})
				cccdId = cccd.id
				logger.info(`[server-actions]: (Update-Student): Created new CCCD. (INFO-END). [ID: ${cccdId}]`)
			}
		}

		if (allFormData.includepassport || allFormData.passportId) {
			if (allFormData.passportId) {
				await prisma.identification.update({
					where: {
						id: allFormData.passportId,
					},
					data: {
						...passportFormData,
						issueDate: new Date(passportFormData.issueDate),
						expiryDate: new Date(passportFormData.expiryDate),
						type: 'PASSPORT',
					},
				})
				logger.info(`[server-actions]: (Update-Student): Updated passport. (INFO-END). [ID: ${allFormData.passportId}]`)
			} else {
				const passport = await prisma.identification.create({
					data: {
						...passportFormData,
						issueDate: new Date(passportFormData.issueDate),
						expiryDate: new Date(passportFormData.expiryDate),
						type: 'PASSPORT',
					},
				})
				passportId = passport.id
				logger.info(`[server-actions]: (Update-Student): Created new passport. (INFO-END). [ID: ${passportId}]`)
			}
		}

		await prisma.student.update({
			where: {
				studentId: allFormData.studentId,
			},
			data: {
				...studentFormData,
				dob: new Date(studentFormData.dob),
				facultyId: studentFormData.facultyId,
				programId: studentFormData.programId,
				statusId: studentFormData.statusId,

				permaAddressId: allFormData.permaAddressId || permaAddressId || null,
				tempAddressId: allFormData.tempAddressId || tempAddressId || null,

				cmndId: allFormData.cmndId || cmndId || null,
				cccdId: allFormData.cccdId || cccdId || null,
				passportId: allFormData.passportId || passportId || null,
			},
		})

		logger.info(
			`[server-actions]: (Update-Student): Student updated successfully. (INFO-END). [StudentID: ${studentFormData.studentId}]`,
		)

		result.success = true
		result.error = false

		return result
	} catch (err: any) {
		logger.error(`[server-actions]: (Update-Student): Error. (ERROR-END). [${err.message}]`)

		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-Student): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: allFormData,
			}
		}
		return {
			success: false,
			error: true,
			errors: null,
			data: allFormData,
		}
	}
}

// ---------------------------------------------
//              FACULTIES
// ---------------------------------------------
export const createFaculty = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Create-Faculty): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const facultyFormData: FacultySchema | any = Object.fromEntries(formData)
	const validatedFacultyFormData = facultySchema.safeParse(facultyFormData)
	try {
		if (!validatedFacultyFormData.success) {
			const formFieldErrors = validatedFacultyFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Create-Faculty): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: facultyFormData,
			}
		}

		const refinedData = {
			name: validatedFacultyFormData.data.name,
		}

		await prisma.faculty.create({
			data: refinedData,
		})

		logger.info(`[server-actions]: (Create-Faculty): Faculty created successfully. (INFO-END). [${refinedData.name}]`)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-Faculty): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: facultyFormData,
			}
		}
		logger.error(`[server-actions]: (Create-Faculty): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: facultyFormData,
		}
	}
}

export const updateFaculty = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Update-Faculty): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const facultyFormData: FacultySchema | any = Object.fromEntries(formData)
	const validatedFacultyFormData = facultySchema.safeParse(facultyFormData)

	try {
		if (!validatedFacultyFormData.success) {
			const formFieldErrors = validatedFacultyFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Update-Faculty): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: facultyFormData,
			}
		}

		await prisma.faculty.update({
			where: {
				id: validatedFacultyFormData.data.id,
			},
			data: validatedFacultyFormData.data,
		})

		logger.info(
			`[server-actions]: (Update-Faculty): Faculty updated successfully. (INFO-END). [${validatedFacultyFormData.data.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-Faculty): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: facultyFormData,
			}
		}
		logger.error(`[server-actions]: (Update-Faculty): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: facultyFormData,
		}
	}
}

export const deleteFaculty = async (currentState: CurrentState, data: FormData) => {
	logger.debug(`[server-actions]: (Delete-Faculty): Received form data. (DEBUG-END). [${data.get('id')}]`)
	try {
		const id = data.get('id') as string

		await prisma.faculty.delete({
			where: {
				id: parseInt(id),
			},
		})

		logger.info(`[server-actions]: (Delete-Faculty): Faculty deleted successfully. (INFO-END). [${id}]`)
		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-Faculty): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}

// ---------------------------------------------
//              PROGRAMS
// ---------------------------------------------
export const createProgram = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Create-Program): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const programFormData: ProgramSchema | any = Object.fromEntries(formData)
	const validatedProgramFormData = programSchema.safeParse(programFormData)
	try {
		if (!validatedProgramFormData.success) {
			const formFieldErrors = validatedProgramFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Create-Program): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: programFormData,
			}
		}

		const refinedData = {
			name: validatedProgramFormData.data.name,
		}

		await prisma.program.create({
			data: refinedData,
		})

		logger.info(`[server-actions]: (Create-Program): Program created successfully. (INFO-END). [${refinedData.name}]`)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-Program): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: programFormData,
			}
		}
		logger.error(`[server-actions]: (Create-Program): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: programFormData,
		}
	}
}

export const updateProgram = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Update-Program): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const programFormData: ProgramSchema | any = Object.fromEntries(formData)
	const validatedProgramFormData = programSchema.safeParse(programFormData)
	try {
		if (!validatedProgramFormData.success) {
			const formFieldErrors = validatedProgramFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Update-Program): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: programFormData,
			}
		}

		await prisma.program.update({
			where: {
				id: validatedProgramFormData.data.id,
			},
			data: {
				name: validatedProgramFormData.data.name,
			},
		})

		logger.info(
			`[server-actions]: (Update-Program): Program updated successfully. (INFO-END). [${validatedProgramFormData.data.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-Program): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: programFormData,
			}
		}
		logger.error(`[server-actions]: (Update-Program): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: programFormData,
		}
	}
}

export const deleteProgram = async (currentState: CurrentState, data: FormData) => {
	logger.debug(`[server-actions]: (Delete-Program): Received form data. (DEBUG-END). [${data.get('id')}]`)
	try {
		const id = data.get('id') as string

		await prisma.program.delete({
			where: {
				id: parseInt(id),
			},
		})

		logger.info(`[server-actions]: (Delete-Program): Program deleted successfully. (INFO-END). [${id}]`)
		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-Program): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}

// ---------------------------------------------
//              STUDENT STATUSES
// ---------------------------------------------
export const createStudentStatus = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Create-StudentStatus): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const studentStatusFormData: StudentStatusSchema | any = Object.fromEntries(formData)
	const validatedStudentStatusFormData = studentStatusSchema.safeParse(studentStatusFormData)
	try {
		if (!validatedStudentStatusFormData.success) {
			const formFieldErrors = validatedStudentStatusFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Create-StudentStatus): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: studentStatusFormData,
			}
		}

		const refinedData = {
			name: validatedStudentStatusFormData.data.name,
		}

		await prisma.studentStatus.create({
			data: refinedData,
		})

		logger.info(
			`[server-actions]: (Create-StudentStatus): Student status created successfully. (INFO-END). [${refinedData.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-StudentStatus): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: studentStatusFormData,
			}
		}
		logger.error(`[server-actions]: (Create-StudentStatus): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: studentStatusFormData,
		}
	}
}

export const updateStudentStatus = async (currentState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Update-StudentStatus): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const studentStatusFormData: StudentStatusSchema | any = Object.fromEntries(formData)
	const validatedStudentStatusFormData = studentStatusSchema.safeParse(studentStatusFormData)
	try {
		if (!validatedStudentStatusFormData.success) {
			const formFieldErrors = validatedStudentStatusFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Update-StudentStatus): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					name: formFieldErrors?.name?.[0],
				},
				data: studentStatusFormData,
			}
		}

		await prisma.studentStatus.update({
			where: {
				id: validatedStudentStatusFormData.data.id,
			},
			data: {
				name: validatedStudentStatusFormData.data.name,
			},
		})

		logger.info(
			`[server-actions]: (Update-StudentStatus): Student status updated successfully. (INFO-END). [${validatedStudentStatusFormData.data.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-StudentStatus): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: studentStatusFormData,
			}
		}
		logger.error(`[server-actions]: (Update-StudentStatus): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: studentStatusFormData,
		}
	}
}

export const deleteStudentStatus = async (currentState: CurrentState, data: FormData) => {
	logger.debug(`[server-actions]: (Delete-StudentStatus): Received form data. (DEBUG-END). [${data.get('id')}]`)
	try {
		const id = data.get('id') as string

		await prisma.studentStatus.delete({
			where: {
				id: parseInt(id),
			},
		})

		logger.info(`[server-actions]: (Delete-StudentStatus): Student status deleted successfully. (INFO-END). [${id}]`)
		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-StudentStatus): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}

// ---------------------------------------------
//              IMPORT / EXPORT
// ---------------------------------------------
export const exportFile = async (currentState: CurrentState, data: FormData) => {
	const formData: any = Object.fromEntries(data)

	const result: {
		success: boolean
		error: boolean
		errors: any
		data: any
	} = {
		success: false,
		error: false,
		errors: {},
		data: formData,
	}

	if (formData.fileType != 'excel' && formData.fileType != 'json') {
		result.errors = {
			...result.errors,
			fileType: 'Phải chọn định dạng file',
		}
		result.error = true

		return result
	}
	if (formData.fileType === 'json') {
		try {
			const students = await prisma.student.findMany({
				include: {
					faculty: true,
					program: true,
					status: true,
					permaAddress: true,
					tempAddress: true,
					cccd: true,
					cmnd: true,
					passport: true,
				},
			})
			const jsonData = JSON.stringify(students, null, 2)

			const base64Data = Buffer.from(jsonData).toString('base64')

			result.success = true
			result.data = {
				...result.data,
				fileContent: base64Data,
				fileName: 'students.json',
				fileType: 'application/json',
			}
		} catch (error) {
			result.errors = {
				...result.errors,
				server: 'Lỗi khi lấy dữ liệu học sinh',
			}
			result.error = true
		}
		return result
	}

	if (formData.fileType === 'excel') {
		try {
			const students = await prisma.student.findMany({
				include: {
					faculty: true,
					program: true,
					status: true,
					permaAddress: true,
					tempAddress: true,
					cccd: true,
					cmnd: true,
					passport: true,
				},
			})

			// Tạo workbook và worksheet
			const workbook = new Workbook()
			const worksheet = workbook.addWorksheet('Students')

			// Định nghĩa các cột
			worksheet.columns = [
				{ header: 'ID', key: 'id', width: 10 },
				{ header: 'Mã SV', key: 'studentId', width: 15 },
				{ header: 'Họ tên', key: 'name', width: 20 },
				{ header: 'Ngày sinh', key: 'dob', width: 15 },
				{ header: 'Giới tính', key: 'sex', width: 10 },
				{ header: 'Khóa', key: 'cohort', width: 10 },
				{ header: 'Số điện thoại', key: 'phone', width: 15 },
				{ header: 'Email', key: 'email', width: 25 },
				{ header: 'Mã bưu điện', key: 'zipCode', width: 10 },
				{ header: 'Quốc tịch', key: 'nationality', width: 15 },
				{ header: 'Khoa', key: 'faculty', width: 20 },
				{ header: 'Chương trình', key: 'program', width: 20 },
				{ header: 'Trạng thái', key: 'status', width: 15 },
				// Địa chỉ thường trú
				{ header: 'Số nhà (Thường trú)', key: 'permaAddress_houseNumber', width: 15 },
				{ header: 'Đường (Thường trú)', key: 'permaAddress_street', width: 20 },
				{ header: 'Phường (Thường trú)', key: 'permaAddress_ward', width: 15 },
				{ header: 'Quận (Thường trú)', key: 'permaAddress_district', width: 15 },
				{ header: 'Thành phố (Thường trú)', key: 'permaAddress_city', width: 15 },
				{ header: 'Quốc gia (Thường trú)', key: 'permaAddress_country', width: 15 },
				// Địa chỉ tạm trú
				{ header: 'Số nhà (Tạm trú)', key: 'tempAddress_houseNumber', width: 15 },
				{ header: 'Đường (Tạm trú)', key: 'tempAddress_street', width: 20 },
				{ header: 'Phường (Tạm trú)', key: 'tempAddress_ward', width: 15 },
				{ header: 'Quận (Tạm trú)', key: 'tempAddress_district', width: 15 },
				{ header: 'Thành phố (Tạm trú)', key: 'tempAddress_city', width: 15 },
				{ header: 'Quốc gia (Tạm trú)', key: 'tempAddress_country', width: 15 },
				// CCCD
				{ header: 'Số CCCD', key: 'cccd_number', width: 15 },
				{ header: 'Ngày cấp CCCD', key: 'cccd_issueDate', width: 15 },
				{ header: 'Nơi cấp CCCD', key: 'cccd_issuePlace', width: 15 },
				{ header: 'Có chip CCCD', key: 'cccd_hasChip', width: 10 },
				{ header: 'Quốc gia cấp CCCD', key: 'cccd_issuingCountry', width: 15 },
				{ header: 'Ghi chú CCCD', key: 'cccd_notes', width: 20 },
				// CMND
				{ header: 'Số CMND', key: 'cmnd_number', width: 15 },
				{ header: 'Ngày cấp CMND', key: 'cmnd_issueDate', width: 15 },
				{ header: 'Nơi cấp CMND', key: 'cmnd_issuePlace', width: 15 },
				{ header: 'Có chip CMND', key: 'cmnd_hasChip', width: 10 },
				{ header: 'Quốc gia cấp CMND', key: 'cmnd_issuingCountry', width: 15 },
				{ header: 'Ghi chú CMND', key: 'cmnd_notes', width: 20 },
				// Hộ chiếu
				{ header: 'Số Hộ chiếu', key: 'passport_number', width: 15 },
				{ header: 'Ngày cấp Hộ chiếu', key: 'passport_issueDate', width: 15 },
				{ header: 'Nơi cấp Hộ chiếu', key: 'passport_issuePlace', width: 15 },
				{ header: 'Có chip Hộ chiếu', key: 'passport_hasChip', width: 10 },
				{ header: 'Quốc gia cấp Hộ chiếu', key: 'passport_issuingCountry', width: 15 },
				{ header: 'Ghi chú Hộ chiếu', key: 'passport_notes', width: 20 },
			]

			// Thêm dữ liệu
			students.forEach((student) => {
				worksheet.addRow({
					id: student.id,
					studentId: student.studentId,
					name: student.name,
					dob: student.dob ? student.dob.toISOString().split('T')[0] : '',
					sex: student.sex,
					cohort: student.cohort,
					phone: student.phone || '',
					email: student.email || '',
					zipCode: student.zipCode,
					nationality: student.nationality,
					faculty: student.faculty?.name || '',
					program: student.program?.name || '',
					status: student.status?.name || '',
					// Địa chỉ thường trú
					permaAddress_houseNumber: student.permaAddress?.houseNumber || '',
					permaAddress_street: student.permaAddress?.street || '',
					permaAddress_ward: student.permaAddress?.ward || '',
					permaAddress_district: student.permaAddress?.district || '',
					permaAddress_city: student.permaAddress?.city || '',
					permaAddress_country: student.permaAddress?.country || '',
					// Địa chỉ tạm trú
					tempAddress_houseNumber: student.tempAddress?.houseNumber || '',
					tempAddress_street: student.tempAddress?.street || '',
					tempAddress_ward: student.tempAddress?.ward || '',
					tempAddress_district: student.tempAddress?.district || '',
					tempAddress_city: student.tempAddress?.city || '',
					tempAddress_country: student.tempAddress?.country || '',
					// CCCD
					cccd_number: student.cccd?.number || '',
					cccd_issueDate: student.cccd?.issueDate ? student.cccd.issueDate.toISOString().split('T')[0] : '',
					cccd_issuePlace: student.cccd?.issuePlace || '',
					cccd_hasChip: student.cccd?.hasChip ? 'Có' : student.cccd?.hasChip === false ? 'Không' : '',
					cccd_issuingCountry: student.cccd?.issuingCountry || '',
					cccd_notes: student.cccd?.notes || '',
					// CMND
					cmnd_number: student.cmnd?.number || '',
					cmnd_issueDate: student.cmnd?.issueDate ? student.cmnd.issueDate.toISOString().split('T')[0] : '',
					cmnd_issuePlace: student.cmnd?.issuePlace || '',
					cmnd_hasChip: student.cmnd?.hasChip ? 'Có' : student.cmnd?.hasChip === false ? 'Không' : '',
					cmnd_issuingCountry: student.cmnd?.issuingCountry || '',
					cmnd_notes: student.cmnd?.notes || '',
					// Hộ chiếu
					passport_number: student.passport?.number || '',
					passport_issueDate: student.passport?.issueDate ? student.passport.issueDate.toISOString().split('T')[0] : '',
					passport_issuePlace: student.passport?.issuePlace || '',
					passport_hasChip: student.passport?.hasChip ? 'Có' : student.passport?.hasChip === false ? 'Không' : '',
					passport_issuingCountry: student.passport?.issuingCountry || '',
					passport_notes: student.passport?.notes || '',
				})
			})

			// Tạo buffer và encode thành base64
			const buffer = await workbook.xlsx.writeBuffer()
			const base64Data = Buffer.from(buffer).toString('base64')

			result.success = true
			result.data = {
				...result.data,
				fileContent: base64Data,
				fileName: 'students.xlsx',
				fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			}
			return result
		} catch (error) {
			result.errors = {
				...result.errors,
				server: 'Lỗi khi xử lý file Excel',
			}
			result.error = true
			return result
		}
	}

	return result
}

const handleImportedData = async (data: any) => {
	const errorList = []
	for (const student of data) {
		try {
			const studentIfExisted = await prisma.student.findUnique({
				where: {
					studentId: student.studentId,
				},
			})

			if (studentIfExisted) throw new Error('Student is existed with studenId')

			if (student.permaAddress) {
				const addr = await prisma.address.create({
					data: {
						houseNumber: student.permaAddress.houseNumber,
						street: student.permaAddress.street,
						ward: student.permaAddress.ward,
						district: student.permaAddress.district,
						city: student.permaAddress.city,
						country: student.permaAddress.country,
					},
				})
				student.permaAddress.id = addr.id
			}
			if (student.tempAddress) {
				const addr = await prisma.address.create({
					data: {
						houseNumber: student.tempAddress.houseNumber,
						street: student.tempAddress.street,
						ward: student.tempAddress.ward,
						district: student.tempAddress.district,
						city: student.tempAddress.city,
						country: student.tempAddress.country,
					},
				})
				student.tempAddress.id = addr.id
			}
			if (student.cccd) {
				const identification = await prisma.identification.create({
					data: {
						type: 'CCCD',
						number: student.cccd.number,
						issueDate: student.cccd.issueDate,
						expiryDate: student.cccd.expiryDate,
						issuePlace: student.cccd.issuePlace,
						hasChip: student.cccd.hasChip,
						issuingCountry: student.cccd.issuingCountry,
						notes: student.cccd.notes,
					},
				})
				student.cccd.id = identification.id
			}
			if (student.cmnd) {
				const identification = await prisma.identification.create({
					data: {
						type: 'CMND',
						number: student.cmnd.number,
						issueDate: student.cmnd.issueDate,
						expiryDate: student.cmnd.expiryDate,
						issuePlace: student.cmnd.issuePlace,
						hasChip: student.cmnd.hasChip,
						issuingCountry: student.cmnd.issuingCountry,
						notes: student.cmnd.notes,
					},
				})
				student.cmnd.id = identification.id
			}
			if (student.passport) {
				const identification = await prisma.identification.create({
					data: {
						type: 'PASSPORT',
						number: student.passport.number,
						issueDate: student.passport.issueDate,
						expiryDate: student.passport.expiryDate,
						issuePlace: student.passport.issuePlace,
						hasChip: student.passport.hasChip,
						issuingCountry: student.passport.issuingCountry,
						notes: student.passport.notes,
					},
				})
				student.passport.id = identification.id
			}
			const faculty = await prisma.faculty.findUnique({
				where: {
					name: student?.faculty?.name,
				},
			})
			if (faculty) {
				student.faculty.id = faculty.id
			} else {
				const newRecord = await prisma.faculty.create({
					data: { name: student?.faculty?.name },
				})
				student.faculty.id = newRecord.id
			}
			const program = await prisma.program.findUnique({
				where: {
					name: student?.program?.name,
				},
			})
			if (program) {
				student.program.id = program.id
			} else {
				const newRecord = await prisma.program.create({
					data: { name: student?.program?.name },
				})
				student.program.id = newRecord.id
			}
			const status = await prisma.studentStatus.findUnique({
				where: {
					name: student?.status?.name,
				},
			})
			if (status) {
				student.status.id = status.id
			} else {
				const newRecord = await prisma.studentStatus.create({
					data: { name: student?.status?.name },
				})
				student.status.id = newRecord.id
			}

			await prisma.student.create({
				data: {
					studentId: student.studentId,
					name: student.name,
					dob: new Date(student.dob),
					sex: student.sex,
					cohort: student.cohort,
					phone: student.phone,
					email: student.email,
					zipCode: student.zipCode,
					nationality: student.nationality,
					statusId: student.status.id,
					programId: student.program.id,
					facultyId: student.faculty.id,
					cccdId: student.cccd?.id,
					cmndId: student.cmnd?.id,
					passportId: student.passport?.id,
				},
			})
		} catch (err: any) {
			errorList.push(`[ERROR]: Student with ID: ${student.studentId} fullerr: ${err}`)
		}
	}

	if (errorList.length) {
		const jsonData = JSON.stringify(errorList, null, 2)
		const base64Data = Buffer.from(jsonData).toString('base64')
		return base64Data
	}
	return ''
}

export const importFile = async (currentState: CurrentState, data: FormData) => {
	const formData: any = Object.fromEntries(data)

	const result: {
		success: boolean
		error: boolean
		errors: any
		data: any
	} = {
		success: false,
		error: false,
		errors: {},
		data: formData,
	}

	if (formData.file?.size) {
		const file: File = formData.file
		const fileName = file.name.toLowerCase()

		if (fileName.endsWith('.json') || fileName.endsWith('.xlsx')) {
			try {
				if (fileName.endsWith('.json')) {
					const fileContent = await file.text()
					const students = JSON.parse(fileContent)

					if (Array.isArray(students)) {
						result.success = true
						result.data = { ...formData }
						const base64Data = await handleImportedData(students)
						if (base64Data) {
							result.success = true
							result.error = true
							result.data = {
								...result.data,
								fileContent: base64Data,
								fileName: 'error-log.json',
								fileType: 'application/json',
							}
							return result
						}
					} else {
						result.error = true
						result.errors = {
							file: 'Nội dung file JSON không phải là mảng hợp lệ.',
						}
					}
				} else if (fileName.endsWith('.xlsx')) {
					// Read the Excel file
					const arrayBuffer = await file.arrayBuffer()
					const workbook = XLSX.read(arrayBuffer, { type: 'array' })
					const worksheet = workbook.Sheets[workbook.SheetNames[0]]
					const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

					// Define column headers based on the provided Excel structure
					const headers = rawData[0] as string[]
					const rows = rawData.slice(1) // Skip header row

					// Map Excel rows to student objects
					const students = rows
						.filter((row: any) => row.length > 0) // Skip empty rows
						.map((row: any) => {
							const rowData: { [key: string]: any } = {}
							headers.forEach((header, index) => {
								rowData[header] = row[index] || null
							})

							return {
								id: rowData['ID'] ? parseInt(rowData['ID']) : null,
								studentId: rowData['Mã SV'] || null,
								name: rowData['Họ tên'] || null,
								dob: rowData['Ngày sinh'] ? new Date(rowData['Ngày sinh']).toISOString() : null,
								sex: rowData['Giới tính'] || null,
								cohort: rowData['Khóa'] ? parseInt(rowData['Khóa']) : null,
								phone: rowData['Số điện thoại'] || null,
								email: rowData['Email'] || null,
								zipCode: rowData['Mã bưu điện'] ? parseInt(rowData['Mã bưu điện']) : null,
								nationality: rowData['Quốc tịch'] || null,
								faculty: {
									id: null, // Excel doesn't provide faculty ID, set to null
									name: rowData['Khoa'] || null,
								},
								program: {
									id: null, // Excel doesn't provide program ID, set to null
									name: rowData['Chương trình'] || null,
								},
								status: {
									id: null, // Excel doesn't provide status ID, set to null
									name: rowData['Trạng thái'] || null,
								},
								permaAddress: rowData['Số nhà (Thường trú)']
									? {
											id: null, // Excel doesn't provide address ID
											houseNumber: rowData['Số nhà (Thường trú)'] || null,
											street: rowData['Đường (Thường trú)'] || null,
											ward: rowData['Phường (Thường trú)'] || null,
											district: rowData['Quận (Thường trú)'] || null,
											city: rowData['Thành phố (Thường trú)'] || null,
											country: rowData['Quốc gia (Thường trú)'] || null,
										}
									: null,
								tempAddress: rowData['Số nhà (Tạm trú)']
									? {
											id: null, // Excel doesn't provide address ID
											houseNumber: rowData['Số nhà (Tạm trú)'] || null,
											street: rowData['Đường (Tạm trú)'] || null,
											ward: rowData['Phường (Tạm trú)'] || null,
											district: rowData['Quận (Tạm trú)'] || null,
											city: rowData['Thành phố (Tạm trú)'] || null,
											country: rowData['Quốc gia (Tạm trú)'] || null,
										}
									: null,
								cccd: rowData['Số CCCD']
									? {
											id: null, // Excel doesn't provide CCCD ID
											type: 'CCCD',
											number: rowData['Số CCCD'] || null,
											issueDate: rowData['Ngày cấp CCCD'] ? new Date(rowData['Ngày cấp CCCD']).toISOString() : null,
											expiryDate: null, // Excel doesn't provide expiry date
											issuePlace: rowData['Nơi cấp CCCD'] || null,
											hasChip:
												rowData['Có chip CCCD'] === 'Có' ? true : rowData['Có chip CCCD'] === 'Không' ? false : null,
											issuingCountry: rowData['Quốc gia cấp CCCD'] || null,
											notes: rowData['Ghi chú CCCD'] || null,
										}
									: null,
								cmnd: rowData['Số CMND']
									? {
											id: null, // Excel doesn't provide CMND ID
											type: 'CMND',
											number: rowData['Số CMND'] || null,
											issueDate: rowData['Ngày cấp CMND'] ? new Date(rowData['Ngày cấp CMND']).toISOString() : null,
											expiryDate: null, // Excel doesn't provide expiry date
											issuePlace: rowData['Nơi cấp CMND'] || null,
											hasChip:
												rowData['Có chip CMND'] === 'Có' ? true : rowData['Có chip CMND'] === 'Không' ? false : null,
											issuingCountry: rowData['Quốc gia cấp CMND'] || null,
											notes: rowData['Ghi chú CMND'] || null,
										}
									: null,
								passport: rowData['Số Hộ chiếu']
									? {
											id: null, // Excel doesn't provide passport ID
											type: 'PASSPORT',
											number: rowData['Số Hộ chiếu'] || null,
											issueDate: rowData['Ngày cấp Hộ chiếu']
												? new Date(rowData['Ngày cấp Hộ chiếu']).toISOString()
												: null,
											expiryDate: null, // Excel doesn't provide expiry date
											issuePlace: rowData['Nơi cấp Hộ chiếu'] || null,
											hasChip:
												rowData['Có chip Hộ chiếu'] === 'Có'
													? true
													: rowData['Có chip Hộ chiếu'] === 'Không'
														? false
														: null,
											issuingCountry: rowData['Quốc gia cấp Hộ chiếu'] || null,
											notes: rowData['Ghi chú Họ chiếu'] || null,
										}
									: null,
							}
						})

					if (students.length > 0) {
						result.success = true
						result.data = { ...formData }
						const base64Data = await handleImportedData(students)
						if (base64Data) {
							result.success = true
							result.error = true
							result.data = {
								...result.data,
								fileContent: base64Data,
								fileName: 'error-log.json',
								fileType: 'application/json',
							}
							return result
						}
					} else {
						result.error = true
						result.errors = {
							file: 'File Excel không chứa dữ liệu hợp lệ.',
						}
					}
				}
			} catch (error: any) {
				result.error = true
				result.errors = {
					file: `Lỗi khi đọc file: ${error.message}`,
				}
			}
		}
	} else {
		result.error = true
		result.errors = {
			file: 'Bạn chưa chọn file.',
		}
	}

	return result
}

// ---------------------------------------------
//              TEACHER
// ---------------------------------------------
export const createTeacher = async (currenState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Create-Teacher): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const teacherFormData: TeacherSchema | any = Object.fromEntries(formData)
	const validatedTeacherFormData = teacherSchema.safeParse(teacherFormData)
	try {
		if (!validatedTeacherFormData.success) {
			const formFieldErrors = validatedTeacherFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Create-Teacher): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					teacherId: formFieldErrors?.teacherId?.[0],
					name: formFieldErrors?.name?.[0],
				},
				data: teacherFormData,
			}
		}

		const refinedData = {
			teacherId: validatedTeacherFormData.data.teacherId,
			name: validatedTeacherFormData.data.name,
		}

		await prisma.teacher.create({
			data: refinedData,
		})

		logger.info(
			`[server-actions]: (Create-Teacher): Teacher created successfully. (INFO-END). [${teacherFormData.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-Teacher): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: teacherFormData,
			}
		}
		logger.error(`[server-actions]: (Create-Teacher): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: teacherFormData,
		}
	}
}

export const updateTeacher = async (currenState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Update-Teacher): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const teacherFormData: TeacherSchema | any = Object.fromEntries(formData)
	const validatedTeacherFormData = teacherSchema.safeParse(teacherFormData)
	try {
		if (!validatedTeacherFormData.success) {
			const formFieldErrors = validatedTeacherFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Update-Teacher): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					teacherId: formFieldErrors?.teacherId?.[0],
					name: formFieldErrors?.name?.[0],
				},
				data: teacherFormData,
			}
		}

		const refinedData = {
			teacherId: validatedTeacherFormData.data.teacherId,
			name: validatedTeacherFormData.data.name,
		}

		await prisma.teacher.update({
			where: {
				id: parseInt(teacherFormData.id),
			},
			data: refinedData,
		})

		logger.info(
			`[server-actions]: (Update-Teacher): Teacher updated successfully. (INFO-END). [${teacherFormData.name}]`,
		)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-Teacher): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: teacherFormData,
			}
		}
		logger.error(`[server-actions]: (Update-Teacher): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: teacherFormData,
		}
	}
}

export const deleteTeacher = async (currentState: CurrentState, data: FormData) => {
	logger.debug(`[server-actions]: (Delete-Teacher): Received form data. (DEBUG-END). [${data.get('id')}]`)
	try {
		const id = data.get('id') as string

		await prisma.teacher.delete({
			where: {
				id: parseInt(id),
			},
		})

		logger.info(`[server-actions]: (Delete-Teacher): Teacher deleted successfully. (INFO-END). [${id}]`)
		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-Teacher): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}

// ---------------------------------------------
//              COURSE
// ---------------------------------------------
export const createCourse = async (currenState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Create-Course): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const courseFormData: CourseSchema | any = Object.fromEntries(formData)
	const validatedCourseFormData = courseSchema.safeParse(courseFormData)
	try {
		if (!validatedCourseFormData.success) {
			const formFieldErrors = validatedCourseFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Create-Course): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					courseId: formFieldErrors?.courseId?.[0],
					credits: formFieldErrors?.credits?.[0],
					name: formFieldErrors?.name?.[0],
					description: formFieldErrors?.description?.[0],
				},
				data: courseFormData,
			}
		}

		const faculty = await prisma.faculty.findUnique({ where: { id: parseInt(courseFormData.facultyId) } })

		if (!faculty) {
			return {
				success: false,
				error: true,
				errors: {
					facultyId: 'Khoa không tồn tại',
				},
				data: courseFormData,
			}
		}

		const preCourse = await prisma.course.findUnique({ where: { courseId: courseFormData.preCourseId } })

		if (courseFormData.preCourseId && !preCourse) {
			return {
				success: false,
				error: true,
				errors: {
					preCourseId: 'Môn tiên quyết không tồn tại',
				},
				data: courseFormData,
			}
		}

		const refinedData = {
			...validatedCourseFormData.data,
			preCourseId: preCourse?.id,
			facultyId: faculty?.id,
		}

		await prisma.course.create({
			data: refinedData,
		})

		logger.info(`[server-actions]: (Create-Course): Course created successfully. (INFO-END). [${courseFormData.name}]`)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Create-Course): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: courseFormData,
			}
		}
		logger.error(`[server-actions]: (Create-Course): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: courseFormData,
		}
	}
}

export const updateCourse = async (currenState: CurrentState, formData: FormData) => {
	logger.debug(
		`[server-actions]: (Update-Course): Received form data. (DEBUG-END). [${JSON.stringify(Object.fromEntries(formData))}]`,
	)
	const courseFormData: CourseSchema | any = Object.fromEntries(formData)
	const validatedCourseFormData = courseSchema.safeParse(courseFormData)
	try {
		if (!validatedCourseFormData.success) {
			const formFieldErrors = validatedCourseFormData.error.flatten().fieldErrors
			logger.error(
				`[server-actions]: (Update-Course): Validation failed. (ERROR-END). [${JSON.stringify(formFieldErrors)}]`,
			)
			return {
				success: false,
				error: true,
				errors: {
					courseId: formFieldErrors?.courseId?.[0],
					credits: formFieldErrors?.credits?.[0],
					name: formFieldErrors?.name?.[0],
					description: formFieldErrors?.description?.[0],
				},
				data: courseFormData,
			}
		}

		const faculty = await prisma.faculty.findUnique({ where: { id: parseInt(courseFormData.facultyId) } })
		const preCourse = await prisma.course.findUnique({ where: { courseId: courseFormData.preCourseId } })

		if (!faculty) {
			return {
				success: false,
				error: true,
				errors: {
					facultyId: 'Khoa không tồn tại',
				},
				data: courseFormData,
			}
		}

		if (courseFormData.preCourseId && !preCourse) {
			return {
				success: false,
				error: true,
				errors: {
					preCourseId: 'Môn tiên quyết không tồn tại',
				},
				data: courseFormData,
			}
		}

		const refinedData = {
			...validatedCourseFormData.data,
			preCourseId: preCourse?.id || null,
			facultyId: faculty?.id,
		}

		await prisma.course.update({
			where: {
				id: parseInt(courseFormData.id),
			},
			data: refinedData,
		})

		logger.info(`[server-actions]: (Update-Course): Course created successfully. (INFO-END). [${courseFormData.name}]`)
		return {
			success: true,
			error: false,
			errors: null,
			data: null,
		}
	} catch (err: any) {
		if (err.code == 'P2002') {
			const field = err.meta?.target?.[0] || 'unknown'
			logger.error(`[server-actions]: (Update-Course): Duplicate entry. (ERROR-END). [${field}: ${err.message}]`)
			return {
				success: false,
				error: true,
				errors: {
					[field]: 'Đã tồn tại',
				},
				data: courseFormData,
			}
		}
		logger.error(`[server-actions]: (Update-Course): Error. (ERROR-END). [${err.message}]`)
		return {
			success: false,
			error: true,
			errors: null,
			data: courseFormData,
		}
	}
}

export const deleteCourse = async (currentState: CurrentState, data: FormData) => {
	logger.debug(`[server-actions]: (Delete-Course): Received form data. (DEBUG-END). [${data.get('id')}]`)
	try {
		const id = data.get('id') as string

		const course = await prisma.course.findUnique({
			where: {
				id: parseInt(id),
			},
		})

		if (!course) {
			return {
				success: false,
				error: true,
			}
		}

		if (course.isDeactived) {
			return {
				success: false,
				error: true,
			}
		}

		const time_now = new Date()
		const time_created = new Date(course.createdAt)

		const time_diff = time_now.getTime() - time_created.getTime()
		const minutes_diff = time_diff / (1000 * 60)

		if (minutes_diff > 30) {
			return {
				success: false,
				error: true,
			}
		}

		const classes = await prisma.class.findMany({
			where: {
				courseId: course.id,
			},
		})

		if (classes.length > 0) {
			await prisma.course.update({
				where: {
					id: course.id,
				},
				data: {
					...course,
					isDeactived: true,
				},
			})
			return {
				success: false,
				error: true,
			}
		}

		await prisma.course.delete({
			where: {
				id: parseInt(id),
			},
		})

		logger.info(`[server-actions]: (Delete-Course): Course deleted successfully. (INFO-END). [${id}]`)
		return {
			success: true,
			error: false,
		}
	} catch (err: any) {
		logger.error(`[server-actions]: (Delete-Course): Error. (ERROR-END). [${err.message}]`)
		return {
			success: true,
			error: false,
		}
	}
}
