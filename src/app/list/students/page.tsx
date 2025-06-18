import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'
import { IoEyeSharp } from 'react-icons/io5'
import { ITEM_PER_PAGE } from '@/lib/settings'

import { Faculty, Prisma, Program, Student, StudentSex, StudentStatus } from '@prisma/client'
import prisma from '@/lib/prisma'
import FormModal from '@/components/FormModal'
import TableSearch from '@/components/ui/TableSearch'
import { logger } from '@/services/logger'
import FilterBar from '@/components/ui/FilterBar'
import Link from 'next/link'

type StudentList = Student & { faculty: Faculty; program: Program; status: StudentStatus }

const columns = [
	{
		header: '',
		accessor: 'view',
		className: 'px-2 py-1',
	},
	{
		header: 'MSSV',
		accessor: 'studentId',
		className: 'px-2 py-1',
	},
	{
		header: 'Họ tên',
		accessor: 'name',
	},
	{
		header: 'Ngày sinh',
		accessor: 'dob',
	},
	{
		header: 'SĐT',
		accessor: 'phone',
	},
	{
		header: 'Email',
		accessor: 'email',
	},
	{
		header: 'Giới tính',
		accessor: 'sex',
	},
	{
		header: 'Khoa',
		accessor: 'faculty',
	},
	{
		header: 'Chương trình',
		accessor: 'program',
	},
	{
		header: 'Trạng thái',
		accessor: 'studentStatus',
	},
	{
		header: '',
		accessor: 'actions',
	},
]

export default async function StudentListPage({
	searchParams,
}: {
	searchParams: { [key: string]: undefined | string }
}) {
	const [faculties, programs, studentStatuses] = await prisma.$transaction([
		prisma.faculty.findMany(),
		prisma.program.findMany(),
		prisma.studentStatus.findMany(),
	])

	const relatedData = {
		faculties: faculties,
		programs: programs,
		studentStatuses: studentStatuses,
	}

	const renderRow = (item: StudentList) => (
		<tr key={item.id}>
			<td className="px-2 py-1 text-gray-500 hover:text-gray-800">
				<Link href={`/student/${item.id}`}>
					<IoEyeSharp />
				</Link>
			</td>
			<td className="px-2 py-1">{item.studentId}</td>
			<td className="px-2 py-1">{item.name}</td>
			<td className="px-2 py-1">{item.dob.toLocaleDateString()}</td>
			<td className="px-2 py-1">{item.phone}</td>
			<td className="px-2 py-1">{item.email}</td>
			<td className="px-2 py-1">{item.sex === StudentSex.MALE ? 'Nam' : 'Nữ'}</td>
			<td className="px-2 py-1">{item.faculty.name}</td>
			<td className="px-2 py-1">{item.program.name}</td>
			<td className="px-2 py-1">{item.status.name}</td>
			<td>
				<div className="flex gap-2">
					<FormModal
						tableName="student"
						type="delete"
						id={item.id}
						children={
							<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-sm hover:cursor-pointer hover:bg-gray-300">
								Xóa
							</div>
						}
					/>
					<FormModal
						tableName="student"
						type="update"
						data={item}
						relatedData={relatedData}
						children={
							<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-sm hover:cursor-pointer hover:bg-gray-300">
								Sửa
							</div>
						}
					/>
				</div>
			</td>
		</tr>
	)

	const { page, ...queryParams } = await searchParams

	const p = page ? parseInt(page) : 1

	const query: Prisma.StudentWhereInput = {}

	if (queryParams) {
		for (const [key, value] of Object.entries(queryParams)) {
			if (value != undefined) {
				switch (key) {
					case 'search':
						query.OR = [{ name: { contains: value, mode: 'insensitive' } }, { studentId: { startsWith: value } }]
						break
					case 'faculty':
						if (!value) break
						query.facultyId = parseInt(value)
						break
					default:
						break
				}
			}
		}
	}

	const [data, count] = await prisma.$transaction([
		prisma.student.findMany({
			where: query,
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
			orderBy: {
				studentId: 'asc',
			},
			include: {
				faculty: true,
				program: true,
				status: true,
				tempAddress: true,
				permaAddress: true,
				cccd: true,
				cmnd: true,
				passport: true,
			},
		}),
		prisma.student.count({
			where: query,
		}),
	])

	return (
		<div className="mx-16 flex flex-col justify-between">
			{/* Tools bar Section - Start */}
			<div className="flex flex-col items-center justify-around">
				<div className="flex items-center justify-between">
					<TableSearch />
					<FilterBar data={relatedData} />
				</div>
				<div className="flex gap-2">
					<FormModal
						tableName="student"
						type="create"
						relatedData={relatedData}
						children={
							<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
								Thêm
							</div>
						}
					/>
					<FormModal
						tableName="export"
						type="create"
						relatedData={{ name: 'student' }}
						children={
							<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
								Xuất
							</div>
						}
					/>
					<FormModal
						tableName="export"
						type="update"
						relatedData={{ name: 'student' }}
						children={
							<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
								Nhập
							</div>
						}
					/>
				</div>
			</div>
			{/* Tools bar Section - End */}

			{/* Table Section - Start */}
			<Table columns={columns} renderRow={renderRow} data={data} />
			{/* Table Section - End */}

			<Pagination page={p} count={count}></Pagination>
		</div>
	)
}
