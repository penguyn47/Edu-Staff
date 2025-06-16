'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChangeEvent } from 'react'

interface Faculty {
	id: number
	name: string
}

interface FilterBarProps {
	data: {
		faculties: Faculty[]
	}
}

export default function FilterBar({ data }: FilterBarProps) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const params = new URLSearchParams(searchParams.toString())
		params.set('faculty', e.target.value)
		params.set('page', '1')
		router.push(`${pathname}?${params.toString()}`)
	}

	return (
		<select
			name="facultyId"
			className="rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
			onChange={handleOnChange}
			defaultValue={searchParams.get('faculty') || ''}
		>
			<option value="">Chọn khoa</option>
			{data.faculties.map((item) => (
				<option key={item.id} value={item.id}>
					{item.name}
				</option>
			))}
		</select>
	)
}
