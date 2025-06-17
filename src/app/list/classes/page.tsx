import FormModal from '@/components/FormModal'
import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import TableSearch from '@/components/ui/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Class, Faculty } from '@prisma/client'

const columns = [
	{
		header: 'Mã lớp',
		accessor: 'id',
		className: 'px-2 py-1',
	},
	{
		header: 'Môn học',
		accessor: 'courseId',
		className: 'px-2 py-1',
	},
	{
		header: 'Giảng viên',
		accessor: 'teacherId',
		className: 'px-2 py-1',
	},
	{
		header: 'Năm học',
		className: 'px-2 py-1',
		accessor: 'year',
	},
	{
		header: 'Học kì',
		className: 'px-2 py-1',
		accessor: 'semester',
	},
	{
		header: 'SL tối đa',
		className: 'px-2 py-1',
		accessor: 'maxStudent',
	},
	{
		header: 'SL đăng ký',
		className: 'px-2 py-1',
		accessor: 'regStudentCount',
	},
	{
		header: 'Phòng',
		className: 'px-2 py-1',
		accessor: 'room',
	},
	{
		header: 'Lịch',
		className: 'px-2 py-1',
		accessor: 'schedule',
	},
	{
		header: '',
		className: 'px-2 py-1',
		accessor: 'actions',
	},
]

const renderRow = (
	item: Class & {
		_count: { Enrollment: number }
		course: { courseId: string; name: string }
		teacher: { teacherId: string; name: string }
	},
) => (
	<tr key={item.id}>
		<td className="px-2 py-1">{item.classId}</td>
		<td className="px-2 py-1">{item.course.name}</td>
		<td className="px-2 py-1">{item.teacher.name}</td>
		<td className="px-2 py-1">{item.year}</td>
		<td className="px-2 py-1">{item.semester}</td>
		<td className="px-2 py-1">{item.maxStudent}</td>
		<td className="px-2 py-1">{item._count.Enrollment}</td>
		<td className="px-2 py-1">{item.room}</td>
		<td className="px-2 py-1">{item.schedule}</td>

		<td className="px-2 py-1">
			<div className="flex justify-end gap-2">
				<FormModal
					tableName="class"
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

export default async function ClassListPage({ searchParams }: { searchParams: { [key: string]: undefined | string } }) {
	const { page, ...queryParams } = await searchParams

	const p = page ? parseInt(page) : 1

	const [data, count] = await prisma.$transaction([
		prisma.class.findMany({
			include: {
				teacher: true,
				course: true,
				_count: {
					select: {
						Enrollment: true,
					},
				},
			},
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.class.count(),
	])

	return (
		<div>
			<div className="mx-16 flex flex-col justify-between">
				{/* Tools bar Section - Start */}
				<div className="flex flex-col items-center justify-around">
					<TableSearch />
					<div>
						<FormModal
							tableName="class"
							type="create"
							children={
								<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
									Thêm
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
		</div>
	)
}
