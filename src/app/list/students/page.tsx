import { Table } from '@/components/ui/Table'
import { Pagination } from '@/components/ui/Pagination'

import { ITEM_PER_PAGE } from '@/lib/settings'

import { Prisma, Student, StudentSex, StudentStatus } from '@prisma/client'
import prisma from '@/lib/prisma'
import FormModal from '@/components/FormModal'
import TableSearch from '@/components/ui/TableSearch'

const columns = [
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

const renderRow = (item: Student) => (
	<tr key={item.id}>
		<td className="px-2 py-1">{item.studentId}</td>
		<td>{item.name}</td>
		<td>{item.dob.toLocaleDateString()}</td>
		<td>{item.phone}</td>
		<td>{item.email}</td>
		<td>{item.sex === StudentSex.MALE ? 'Nam' : 'Nữ'}</td>
		<td>{item.faculty}</td>
		<td>{item.program}</td>
		<td>
			{(() => {
				switch (item.status) {
					case 'ACTIVE':
						return 'Đang học'
					case 'GRADUATED':
						return 'Đã tốt nghiệp'
					case 'SUSPENDED':
						return 'Tạm dừng học'
					case 'WITHDRAWN':
						return 'Thôi học'
				}
			})()}
		</td>
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

export default async function StudentListPage({
	searchParams,
}: {
	searchParams: { [key: string]: undefined | string }
}) {
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
		}),
		prisma.student.count(),
	])

	return (
		<div className="mx-16 flex flex-col justify-between">
			{/* Tools bar Section - Start */}
			<div className="flex items-center justify-around">
				<TableSearch />
				<div>
					<FormModal
						tableName="student"
						type="create"
						children={
							<div className="mt-2 rounded-sm bg-gray-200 px-2 py-1 text-xl hover:cursor-pointer hover:bg-gray-300">
								Thêm sinh viên
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
