export const Table = ({
	columns,
	renderRow,
	data,
}: {
	columns: { header: string; accessor: string; className?: string }[]
	renderRow: (item: any) => React.ReactNode
	data: any[]
}) => {
	return (
		<div className="flex w-full justify-center">
			<table className="mt-4 w-fit border">
				<thead className="bg-gray-200">
					<tr className="text-left text-sm text-gray-700">
						{columns.map((col) => (
							<th key={col.accessor} className={col.className}>
								{col.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>{data.map((item) => renderRow(item))}</tbody>
			</table>
		</div>
	)
}
