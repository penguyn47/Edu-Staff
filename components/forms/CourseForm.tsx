import { createCourse, updateCourse } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import InputField from '../InputField'

export default function CourseForm({
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
	const [state, formAction] = useActionState(type === 'create' ? createCourse : updateCourse, {
		success: false,
		error: false,
		errors: null,
		data: data,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Course has been ${type === 'create' ? 'created' : 'updated'}!`)
			setOpen(false)
			router.refresh()
		}
		if (state.error) {
			toast.error(`Something went wrong!`)
		}
	}, [state, type])

	return (
		<div>
			<form className="flex flex-col gap-8" action={formAction}>
				<h1 className="mx-4 text-xl font-semibold">{type === 'create' ? 'Tạo mới Khóa học' : 'Cập nhật Khóa học'}</h1>
				<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
					<input type="text" defaultValue={state.data?.id} className="hidden" name="id" />
					<InputField
						label="Mã môn học"
						name={'courseId'}
						defaultValue={state.data?.courseId}
						error={state.errors?.courseId}
					/>
					<InputField label="Tên môn học" name={'name'} defaultValue={state.data?.name} error={state.errors?.name} />
					<InputField
						label="Số tín chỉ"
						type="number"
						name={'credits'}
						defaultValue={state.data?.credits}
						error={state.errors?.credits}
					/>
					<InputField
						label="Mô tả"
						name={'description'}
						defaultValue={state.data?.description}
						error={state.errors?.description}
					/>
					<div className={'col-span-2 flex w-full flex-col gap-2'}>
						<label className="text-xs text-gray-500">Khoa phụ trách</label>
						<select
							name="facultyId"
							className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
							defaultValue={data?.facultyId}
						>
							<option value="">Chọn khoa</option>
							{relatedData?.faculties.map((item: { id: number; name: string }, index: number) => (
								<option key={item.id} value={item.id}>
									{item.name}
								</option>
							))}
						</select>
						{state.errors?.facultyId && <div className="text-[10px] text-red-500">{state.errors?.facultyId}</div>}
					</div>
					<InputField
						label="Môn tiên quyết"
						name={'preCourseId'}
						defaultValue={state.data?.preCourse?.courseId}
						error={state.errors?.preCourseId}
					/>
				</div>

				<button type="submit" className="rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</form>
		</div>
	)
}
