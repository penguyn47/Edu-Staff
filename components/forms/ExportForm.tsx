import { exportFile, importFile } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import InputField from '../InputField'

export default function ExportForm({
	type,
	data,
	setOpen,
	relatedData,
}: {
	type: 'create' | 'update'
	data?: any
	setOpen: Dispatch<SetStateAction<boolean>>
	relatedData?: any
}) {
	const [state, formAction] = useActionState(type === 'create' ? exportFile : importFile, {
		success: false,
		error: false,
		errors: null,
		data: data,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Students has been ${type === 'create' ? 'Exported' : 'Imported'}!`)

			if (state.data.fileContent && state.data.fileName) {
				try {
					const byteCharacters = atob(state.data.fileContent)
					const byteNumbers = new Array(byteCharacters.length)
					for (let i = 0; i < byteCharacters.length; i++) {
						byteNumbers[i] = byteCharacters.charCodeAt(i)
					}
					const byteArray = new Uint8Array(byteNumbers)
					const blob = new Blob([byteArray], { type: state.data.fileType })

					const url = window.URL.createObjectURL(blob)
					const link = document.createElement('a')
					link.href = url
					link.download = state.data.fileName
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					window.URL.revokeObjectURL(url)
				} catch (error) {
					toast.error('Lỗi khi tải file JSON!')
					console.error(error)
				}
			}

			setOpen(false)
			router.refresh()
		}

		if (state.error) {
			toast.error('Something went wrong!')
			setOpen(false)
			router.refresh()
		}
	}, [state, type, setOpen, router])

	return (
		<div>
			<form className="flex flex-col gap-8" action={formAction}>
				<h1 className="mx-4 text-xl font-semibold">
					{type === 'create' ? `Xuất danh sách ${relatedData.name}` : `Nhập danh sách ${relatedData.name}`}
				</h1>
				<div className="mx-4 grid grid-cols-2 gap-2 gap-x-4">
					{type === 'create' && (
						<div className={'flex w-full flex-col gap-2'}>
							<input type="text" defaultValue={relatedData.name} className="hidden" name="tableName" />

							<label className="text-xs text-gray-500">Kiểu tệp</label>
							<select
								name="fileType"
								className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
								defaultValue={data?.fileType}
							>
								<option value="">Chọn kiểu tệp</option>
								<option value="excel">Excel</option>
								<option value="json">Json</option>
							</select>
							{state.errors?.fileType && <div className="text-[10px] text-red-500">{state.errors?.fileType}</div>}
						</div>
					)}
					{type === 'update' && (
						<div className="flex w-full flex-col">
							<label className="mb-2 text-xs text-gray-500">File: (hỗ trợ: json, xlxs)</label>
							<input
								type="file"
								name="file"
								accept=".xlsx,.json"
								className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300 read-only:bg-gray-200 hover:cursor-pointer"
							/>
							{state.errors?.file && <div className="mt-2 text-[10px] text-red-500">{state.errors?.file}</div>}
						</div>
					)}
				</div>

				<button type="submit" className="rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Xuất' : 'Nhập'}
				</button>
			</form>
		</div>
	)
}
