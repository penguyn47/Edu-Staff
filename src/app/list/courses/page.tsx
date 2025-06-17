import FormModal from '@/components/FormModal'
import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import TableSearch from '@/components/ui/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Course, Teacher } from '@prisma/client'

const columns = [
	{
		header: 'Trạng thái',
		accessor: 'isDeactived',
		className: 'px-2 py-1',
	},
	{
		header: 'Mã Khóa học',
		accessor: 'courseId',
		className: 'px-2 py-1',
	},
	{
		header: 'Tên Khóa học',
		accessor: 'name',
		className: 'px-2 py-1',
	},
	{
		header: 'Số tín chỉ',
		accessor: 'credits',
		className: 'px-2 py-1',
	},
	{
		header: 'Khoa',
		accessor: 'faculty',
		className: 'px-2 py-1',
	},
	{
		header: 'Môn tiên quyết',
		accessor: 'preCourse',
		className: 'px-2 py-1',
	},
	{
		header: 'Mô tả',
		accessor: 'description',
		className: 'px-2 py-1',
	},
	{
		header: '',
		accessor: 'actions',
		className: 'px-2 py-1',
	},
]

export default async function CourseListPage({
	searchParams,
}: {
	searchParams: { [key: string]: undefined | string }
}) {
	const [faculties, courses] = await prisma.$transaction([prisma.faculty.findMany(), prisma.course.findMany()])

	const relatedData = {
		faculties: faculties,
		programs: courses,
	}

	const renderRow = (
		item: Course & { preCourse: { courseId: string; name: string } } & { faculty: { name: string } },
	) => (
		<tr key={item.id}>
			<td className="flex items-center justify-center pt-3">
				{item.isDeactived ? (
					<div className="h-3 w-3 rounded-full bg-red-500"></div>
				) : (
					<div className="h-3 w-3 rounded-full bg-green-500"></div>
				)}
			</td>
			<td className="px-2 py-1">{item.courseId}</td>
			<td className="px-2 py-1">{item.name}</td>
			<td className="px-2 py-1">{item.credits}</td>
			<td className="px-2 py-1">{item.faculty.name}</td>
			<td className="px-2 py-1">{item.preCourse ? item.preCourse.name : 'Không có'}</td>
			<td className="px-2 py-1">{item.description}</td>
			<td className="px-2 py-1">
				<div className="flex justify-end gap-2">
					<FormModal
						tableName="course"
						type="delete"
						id={item.id}
						children={
							<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-sm hover:cursor-pointer hover:bg-gray-300">
								Xóa
							</div>
						}
					/>

					<FormModal
						tableName="course"
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

	const [data, count] = await prisma.$transaction([
		prisma.course.findMany({
			skip: (p - 1) * ITEM_PER_PAGE,
			take: ITEM_PER_PAGE,
			include: {
				preCourse: true,
				faculty: true,
			},
		}),
		prisma.course.count(),
	])

	return (
		<div>
			<div className="mx-16 flex flex-col justify-between">
				{/* Tools bar Section - Start */}
				<div className="flex flex-col items-center justify-around">
					<TableSearch />

					<div>
						<FormModal
							tableName="course"
							relatedData={relatedData}
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
