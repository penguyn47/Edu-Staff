'use client'

import { ITEM_PER_PAGE } from '@/lib/settings'
import { useRouter } from 'next/navigation'

export const Pagination = ({ page, count }: { page: number; count: number }) => {
	const router = useRouter()

	const hasPrev = ITEM_PER_PAGE * (page - 1) > 0
	const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count

	const changePage = (newPage: number) => {
		const params = new URLSearchParams(window.location.search)
		params.set('page', newPage.toString())
		router.push(`${window.location.pathname}?${params}`)
	}
	return (
		<div className="flex items-center justify-between p-4">
			<button
				disabled={!hasPrev}
				className="rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
				onClick={() => {
					changePage(page - 1)
				}}
			>
				Prev
			</button>
			<div className="flex items-center gap-2 text-sm">
				{Array.from({ length: Math.ceil(count / ITEM_PER_PAGE) }, (_, index) => {
					const pageIndex = index + 1
					return (
						<button
							key={pageIndex}
							className={`rounded-sm px-2 ${page === pageIndex ? 'bg-gray-300' : 'hover:cursor-pointer'}`}
							onClick={() => {
								changePage(pageIndex)
							}}
						>
							{pageIndex}
						</button>
					)
				})}
			</div>
			<button
				className="rounded-md bg-gray-200 px-4 py-2 text-xs font-semibold hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
				disabled={!hasNext}
				onClick={() => {
					changePage(page + 1)
				}}
			>
				Next
			</button>
		</div>
	)
}
