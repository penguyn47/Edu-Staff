'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'

export default function TableSearch() {
	const router = useRouter()
	const [searchValue, setSearchValue] = useState('')

	const handleSearch = (value: string) => {
		const params = new URLSearchParams(window.location.search)
		params.set('search', value)
		params.set('page', '1')
		router.push(`${window.location.pathname}?${params}`)
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		handleSearch((e.currentTarget[0] as HTMLInputElement).value)
	}

	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		setSearchValue((e.currentTarget as HTMLInputElement).value)
	}

	useEffect(() => {
		const handler = setTimeout(() => {
			handleSearch(searchValue)
		}, 300)
		return () => clearTimeout(handler)
	}, [searchValue])

	return (
		<form className="flex w-2/3" onSubmit={handleSubmit}>
			<div className="flex w-full items-center justify-center gap-2">
				<input type="text" className="min-w-[800px] rounded-sm border px-2 py-1 text-sm" onChange={handleOnChange} />
				<button className="text-gray-800 hover:cursor-pointer hover:text-gray-400">
					<FaSearch className="text-2xl" />
				</button>
			</div>
		</form>
	)
}
