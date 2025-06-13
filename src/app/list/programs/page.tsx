import { Pagination } from '@/components/ui/Pagination'
import { Table } from '@/components/ui/Table'
import TableSearch from '@/components/ui/TableSearch'
import prisma from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { Faculty, Program } from '@prisma/client'

const columns = [
	{
		header: 'ID',
		accessor: 'id',
		className: 'px-2 py-1',
	},
	{
		header: 'Tên chương trình',
		accessor: 'name',
	},
]

const renderRow = (item: Program) => (
	<tr key={item.id}>
		<td className="px-2 py-1">{item.id}</td>
		<td className="px-2 py-1">{item.name}</td>
	</tr>
)

export default async function ProgramListPage({
	searchParams,
}: {
	searchParams: { [key: string]: undefined | string }
}) {
	const { page, ...queryParams } = await searchParams

	const p = page ? parseInt(page) : 1

	const [data, count] = await prisma.$transaction([
		prisma.program.findMany({
			take: ITEM_PER_PAGE,
			skip: ITEM_PER_PAGE * (p - 1),
		}),
		prisma.program.count(),
	])

	return (
		<div>
			<div className="mx-16 flex flex-col justify-between">
				{/* Tools bar Section - Start */}
				<div className="flex items-center justify-around">
					<TableSearch />
					{/* <div>
						<FormModal
							tableName="student"
							type="create"
							children={
								<div className="mt-2 rounded-sm bg-gray-200 px-2 py-1 text-xl hover:cursor-pointer hover:bg-gray-300">
									Thêm sinh viên
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
