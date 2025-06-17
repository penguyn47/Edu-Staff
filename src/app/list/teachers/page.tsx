import FormModal from '@/components/FormModal'
import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import TableSearch from '@/components/ui/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Teacher } from '@prisma/client'

const columns = [
	{
		header: 'Mã số GV',
		accessor: 'teacherId',
		className: 'px-2 py-1',
	},
	{
		header: 'Tên Giảng Viên',
		accessor: 'name',
		className: 'px-2 py-1',
	},
]

const renderRow = (item: Teacher) => (
	<tr key={item.id}>
		<td className="px-2 py-1">{item.teacherId}</td>
		<td className="px-2 py-1">{item.name}</td>
		{/* <td className="px-2 py-1">
			<div className="flex justify-end gap-2">
				<FormModal
					tableName="faculty"
					type="delete"
					id={item.id}
					children={
						<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-sm hover:cursor-pointer hover:bg-gray-300">
							Xóa
						</div>
					}
				/>

				<FormModal
					tableName="faculty"
					type="update"
					data={item}
					children={
						<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-sm hover:cursor-pointer hover:bg-gray-300">
							Sửa
						</div>
					}
				/>
			</div>
		</td> */}
	</tr>
)

export default async function TeacherListPage({
	searchParams,
}: {
	searchParams: { [key: string]: undefined | string }
}) {
	const { page, ...queryParams } = await searchParams

	const p = page ? parseInt(page) : 1

	const [data, count] = await prisma.$transaction([
		prisma.teacher.findMany({
			skip: (p - 1) * ITEM_PER_PAGE,
			take: ITEM_PER_PAGE,
		}),
		prisma.teacher.count(),
	])

	return (
		<div>
			<div className="mx-16 flex flex-col justify-between">
				{/* Tools bar Section - Start */}
				<div className="flex flex-col items-center justify-around">
					<TableSearch />

					{/* <div>
						<FormModal
							tableName="faculty"
							type="create"
							children={
								<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
									Thêm
								</div>
							}
						/>
					</div> */}
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
