import { PrismaClient, StudentSex, IdentificationType, EnrollmentStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	// Xóa dữ liệu cũ để đảm bảo seed sạch
	await prisma.result.deleteMany()
	await prisma.enrollment.deleteMany()
	await prisma.class.deleteMany()
	await prisma.course.deleteMany()
	await prisma.teacher.deleteMany()
	await prisma.student.deleteMany()
	await prisma.identification.deleteMany()
	await prisma.address.deleteMany()
	await prisma.studentStatus.deleteMany()
	await prisma.program.deleteMany()
	await prisma.faculty.deleteMany()

	// Tạo Khoa (Faculties)
	const faculties = await Promise.all([
		prisma.faculty.create({ data: { name: 'Khoa Luật' } }),
		prisma.faculty.create({ data: { name: 'Khoa Tiếng Anh Thương mại' } }),
		prisma.faculty.create({ data: { name: 'Khoa Tiếng Nhật' } }),
		prisma.faculty.create({ data: { name: 'Khoa Tiếng Pháp' } }),
	])

	// Tạo Chương trình đào tạo (Programs)
	const programs = await Promise.all([
		prisma.program.create({ data: { name: 'Cử nhân Luật' } }),
		prisma.program.create({ data: { name: 'Tiếng Anh Thương mại' } }),
		prisma.program.create({ data: { name: 'Ngôn ngữ Nhật' } }),
		prisma.program.create({ data: { name: 'Ngôn ngữ Pháp' } }),
	])

	// Tạo Trạng thái sinh viên (Student Statuses)
	const statuses = await Promise.all([
		prisma.studentStatus.create({ data: { name: 'Đang học' } }),
		prisma.studentStatus.create({ data: { name: 'Đã tốt nghiệp' } }),
		prisma.studentStatus.create({ data: { name: 'Đã thôi học' } }),
		prisma.studentStatus.create({ data: { name: 'Tạm dừng học' } }),
	])

	// Tạo Địa chỉ (Addresses)
	const addresses = await Promise.all([
		prisma.address.create({
			data: {
				houseNumber: '123',
				street: 'Nguyễn Trãi',
				ward: 'Phường 7',
				district: 'Quận 5',
				city: 'TP. Hồ Chí Minh',
				country: 'Việt Nam',
			},
		}),
		prisma.address.create({
			data: {
				houseNumber: '456',
				street: 'Lê Lợi',
				ward: 'Phường 1',
				district: 'Quận 1',
				city: 'TP. Hồ Chí Minh',
				country: 'Việt Nam',
			},
		}),
		prisma.address.create({
			data: {
				houseNumber: '789',
				street: 'Trần Hưng Đạo',
				ward: 'Phường 2',
				district: 'Quận 3',
				city: 'TP. Hồ Chí Minh',
				country: 'Việt Nam',
			},
		}),
		prisma.address.create({
			data: {
				houseNumber: '101',
				street: 'Nguyễn Huệ',
				ward: 'Phường Bến Nghé',
				district: 'Quận 1',
				city: 'TP. Hồ Chí Minh',
				country: 'Việt Nam',
			},
		}),
	])

	// Tạo Giấy tờ định danh (Identifications)
	const identifications = await Promise.all(
		[
			// 5 CCCD
			...Array.from({ length: 5 }, (_, i) => ({
				type: IdentificationType.CCCD,
				number: `012345678${String(i + 1).padStart(3, '0')}`,
				issueDate: new Date('2020-01-01'),
				expiryDate: new Date('2030-01-01'),
				issuePlace: 'Cục Cảnh sát Quản lý Hành chính',
				hasChip: true,
				issuingCountry: 'Việt Nam',
			})),
			// 5 CMND
			...Array.from({ length: 5 }, (_, i) => ({
				type: IdentificationType.CMND,
				number: `123456${String(i + 1).padStart(3, '0')}`,
				issueDate: new Date('2018-01-01'),
				expiryDate: new Date('2028-01-01'),
				issuePlace: 'Công an TP. Hồ Chí Minh',
			})),
			// 5 Passport
			...Array.from({ length: 5 }, (_, i) => ({
				type: IdentificationType.PASSPORT,
				number: `P${String(i + 1).padStart(7, '0')}`,
				issueDate: new Date('2021-01-01'),
				expiryDate: new Date('2031-01-01'),
				issuePlace: 'Cục Quản lý Xuất nhập cảnh',
				issuingCountry: i % 2 === 0 ? 'Việt Nam' : 'Japan',
				notes: i % 2 === 0 ? 'Hộ chiếu ngoại giao' : null,
			})),
		].map((data) => prisma.identification.create({ data })),
	)

	// Tạo Sinh viên (Students)
	const students = await Promise.all(
		Array.from({ length: 15 }, (_, i) => {
			const facultyIndex = i % faculties.length
			const programIndex = i % programs.length
			const statusIndex = i % statuses.length
			const addressIndex = i % addresses.length

			const identification = identifications[i]
			const identificationFields = {
				cccdId: identification.type === IdentificationType.CCCD ? identification.id : null,
				cmndId: identification.type === IdentificationType.CMND ? identification.id : null,
				passportId: identification.type === IdentificationType.PASSPORT ? identification.id : null,
			}

			return prisma.student.create({
				data: {
					studentId: `SV${String(i + 1).padStart(4, '0')}`,
					name: [
						'Nguyễn Văn An',
						'Trần Thị Bình',
						'Lê Minh Châu',
						'Phạm Quốc Duy',
						'Hoàng Thị Em',
						'Võ Văn Phong',
						'Đặng Thị Hồng',
						'Bùi Minh Hùng',
						'Ngô Thị Lan',
						'Đỗ Văn Minh',
						'Lý Thị Ngọc',
						'Hà Văn Phúc',
						'Trương Thị Quyên',
						'Phan Văn Sơn',
						'Mai Thị Thanh',
					][i],
					dob: new Date(`2000-${String((i % 12) + 1).padStart(2, '0')}-01`),
					sex: i % 2 === 0 ? StudentSex.MALE : StudentSex.FEMALE,
					cohort: 2020 + (i % 4),
					phone: `090${String(1000000 + i).padStart(7, '0')}`,
					email: `sv${i + 1}@university.edu.vn`,
					zipCode: 70000 + i,
					nationality:
						identification.type === IdentificationType.PASSPORT && identification.issuingCountry === 'Japan'
							? 'Japan'
							: 'Việt Nam',
					statusId: statuses[statusIndex].id,
					facultyId: faculties[facultyIndex].id,
					programId: programs[programIndex].id,
					permaAddressId: addresses[addressIndex].id,
					tempAddressId: addresses[(addressIndex + 1) % addresses.length].id,
					...identificationFields,
				},
			})
		}),
	)

	// Tạo Giảng viên (Teachers)
	const teachers = await Promise.all([
		prisma.teacher.create({ data: { teacherId: 'GV001', name: 'Nguyễn Văn Hùng' } }),
		prisma.teacher.create({ data: { teacherId: 'GV002', name: 'Trần Thị Mai' } }),
		prisma.teacher.create({ data: { teacherId: 'GV003', name: 'Lê Văn Tâm' } }),
	])

	// Tạo Môn học (Courses)
	const courses = await Promise.all([
		prisma.course.create({
			data: {
				courseId: 'LAW101',
				name: 'Luật Dân sự',
				credits: 3,
				facultyId: faculties[0].id,
				description: 'Giới thiệu về luật dân sự',
			},
		}),
		prisma.course.create({
			data: {
				courseId: 'ENG201',
				name: 'Tiếng Anh Thương mại 1',
				credits: 4,
				facultyId: faculties[1].id,
				description: 'Kỹ năng tiếng Anh trong kinh doanh',
			},
		}),
		prisma.course.create({
			data: {
				courseId: 'JPN301',
				name: 'Ngôn ngữ Nhật Bản 1',
				credits: 3,
				facultyId: faculties[2].id,
				description: 'Cơ bản tiếng Nhật',
			},
		}),
		prisma.course.create({
			data: {
				courseId: 'FRE401',
				name: 'Ngôn ngữ Pháp 1',
				credits: 3,
				facultyId: faculties[3].id,
				description: 'Cơ bản tiếng Pháp',
			},
		}),
	])

	// Tạo Lớp học (Classes)
	const classes = await Promise.all([
		prisma.class.create({
			data: {
				classId: 'CLASS001',
				year: 2025,
				semester: 1,
				maxStudent: 30,
				room: 'A101',
				schedule: 'Thứ 2, 8:00-10:00',
				courseId: courses[0].id,
				teacherId: teachers[0].id,
			},
		}),
		prisma.class.create({
			data: {
				classId: 'CLASS002',
				year: 2025,
				semester: 1,
				maxStudent: 25,
				room: 'B202',
				schedule: 'Thứ 3, 10:00-12:00',
				courseId: courses[1].id,
				teacherId: teachers[1].id,
			},
		}),
		prisma.class.create({
			data: {
				classId: 'CLASS003',
				year: 2025,
				semester: 1,
				maxStudent: 20,
				room: 'C303',
				schedule: 'Thứ 4, 13:00-15:00',
				courseId: courses[2].id,
				teacherId: teachers[2].id,
			},
		}),
	])

	// Tạo Đăng ký lớp học (Enrollments)
	const enrollments = await Promise.all(
		Array.from({ length: 10 }, (_, i) => {
			const studentIndex = i % students.length
			const classIndex = i % classes.length
			return prisma.enrollment.create({
				data: {
					studentId: students[studentIndex].id,
					classId: classes[classIndex].id,
					status:
						i % 3 === 0 ? EnrollmentStatus.ACTIVE : i % 3 === 1 ? EnrollmentStatus.FINISHED : EnrollmentStatus.CANCLED,
				},
			})
		}),
	)

	// Tạo Kết quả học tập (Results)
	const results = await Promise.all(
		Array.from({ length: 5 }, (_, i) => {
			const studentIndex = i % students.length
			const courseIndex = i % courses.length
			return prisma.result.create({
				data: {
					studentId: students[studentIndex].id,
					courseId: courses[courseIndex].id,
					credits: courses[courseIndex].credits,
					grade: 7.0 + (i % 4), // Grades from 7.0 to 10.0
				},
			})
		}),
	)

	console.log('Seed data created successfully!')
}

main()
	.catch((e) => {
		console.error('Error seeding data:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
