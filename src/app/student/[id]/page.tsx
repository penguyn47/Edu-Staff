import Transcript from '@/components/docs/Transcript'
import StudentInfoSection from '@/components/StudentInfoSection'
import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import prisma from '@/lib/prisma'
import { Class, Result } from '@prisma/client'

const columns = [
	{
		header: 'Môn học',
		accessor: 'courseName',
		className: 'px-2 py-1',
	},
	{
		header: 'Mã lớp',
		accessor: 'classId',
		className: 'px-2 py-1',
	},
	{
		header: 'Năm',
		accessor: 'year',
		className: 'px-2 py-1',
	},
	{
		header: 'Học kì',
		accessor: 'semester',
		className: 'px-2 py-1',
	},
	{
		header: 'Phòng',
		accessor: 'room',
		className: 'px-2 py-1',
	},
	{
		header: 'Lịch',
		accessor: 'schedule',
		className: 'px-2 py-1',
	},
]

const columns2 = [
	{
		header: 'Mã môn học',
		accessor: 'courseId',
		className: 'px-2 py-1',
	},
	{
		header: 'Môn học',
		accessor: 'courseName',
		className: 'px-2 py-1',
	},
	{
		header: 'Số tín chỉ',
		accessor: 'credits',
		className: 'px-2 py-1',
	},
	{
		header: 'Điểm số',
		accessor: 'grade',
		className: 'px-2 py-1',
	},
]

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params

	const studentData = await prisma.student.findUnique({
		where: { id: parseInt(id) },
		include: {
			faculty: true,
			program: true,
			status: true,
			permaAddress: true,
			tempAddress: true,
			cccd: true,
			passport: true,
			cmnd: true,
		},
	})

	const classData = await prisma.class.findMany({
		select: {
			id: true,
			classId: true,
			year: true,
			semester: true,
			room: true,
			schedule: true,
			course: true,
		},
		where: {
			Enrollment: {
				some: {
					studentId: parseInt(id),
				},
			},
		},
	})

	const resultData = await prisma.result.findMany({
		select: {
			studentId: true,
			courseId: true,
			course: true,
			grade: true,
			credits: true,
		},
		where: {
			studentId: parseInt(id),
		},
	})

	// console.log(resultData)

	const renderRow = (item: Class & { course: { name: string } }) => (
		<tr key={item.id}>
			<td className="px-2 py-1">{item.course.name}</td>
			<td className="px-2 py-1">{item.classId}</td>
			<td className="px-2 py-1">{item.year}</td>
			<td className="px-2 py-1">{item.semester}</td>
			<td className="px-2 py-1">{item.room}</td>
			<td className="px-2 py-1">{item.schedule}</td>
		</tr>
	)

	const renderRowResult = (item: Result & { course: { courseId: string; name: string } }) => (
		<tr key={'#' + item.id}>
			<td className="px-2 py-1">{item.course.courseId}</td>
			<td className="px-2 py-1">{item.course.name}</td>
			<td className="px-2 py-1">{item.credits}</td>
			<td className="px-2 py-1">{item.grade}</td>
		</tr>
	)

	return (
		<div className="mb-20 flex flex-col items-center justify-center gap-4">
			<StudentInfoSection data={studentData} />

			<div className="text-xl font-bold">Các lớp đã đăng ký / đang học</div>
			{/* Table Section - Start */}
			<Table columns={columns} renderRow={renderRow} data={classData} />
			{/* Table Section - End */}

			<div className="text-xl font-bold">Kết quả học tập</div>

			<Table columns={columns2} renderRow={renderRowResult} data={resultData} />

			<Transcript studentData={studentData} resultData={resultData} />
		</div>
	)
}
