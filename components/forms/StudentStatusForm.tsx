import { createProgram, createStudentStatus, updateProgram, updateStudentStatus } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import InputField from '../InputField'

export default function StudentStatusForm({
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
	const [state, formAction] = useActionState(type === 'create' ? createStudentStatus : updateStudentStatus, {
		success: false,
		error: false,
		errors: null,
		data: data,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Faculty has been ${type === 'create' ? 'created' : 'updated'}!`)
			setOpen(false)
			router.refresh()
		}
		if (state.error) {
			toast.error(`Something went wrong!`)
			console.log(state.errors)
		}
	}, [state, type])

	return (
		<div>
			<form className="flex flex-col gap-8" action={formAction}>
				<h1 className="mx-4 text-xl font-semibold">{type === 'create' ? 'Tạo mới khoa' : 'Cập nhật khoa'}</h1>
				<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
					<input type="text" defaultValue={state.data?.id} className="hidden" name="id" />
					<InputField label="Tên khoa" name={'name'} defaultValue={state.data?.name} error={state.errors?.name} />
				</div>

				<button type="submit" className="rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</form>
		</div>
	)
}
