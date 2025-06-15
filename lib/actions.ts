'use server'
import {
	addressSchema,
	facultySchema,
	FacultySchema,
	identificationSchema,
	programSchema,
	ProgramSchema,
	studentSchema,
	StudentSchema,
	StudentStatusSchema,
	studentStatusSchema,
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
