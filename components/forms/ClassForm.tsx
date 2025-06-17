import { createClass, createCourse, updateClass, updateCourse } from '@/lib/actions'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import { toast } from 'react-toastify'
import InputField from '../InputField'

export default function ClassForm({
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
	const [state, formAction] = useActionState(type === 'create' ? createClass : updateClass, {
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
				<h1 className="mx-4 text-xl font-semibold">{type === 'create' ? 'Tạo mới Lớp học' : 'Cập nhật Lớp học'}</h1>
				<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
					<input type="text" defaultValue={state.data?.id} className="hidden" name="id" />
					<InputField
						label="Mã lớp học"
						name={'classId'}
						defaultValue={state.data?.classId}
						error={state.errors?.classId}
					/>
					<InputField
						label="Mã môn học"
						name={'courseId'}
						defaultValue={state.data?.course?.courseId || state.data?.courseId}
						error={state.errors?.courseId}
					/>
					<InputField
						label="Mã giảng viên"
						name={'teacherId'}
						defaultValue={state.data?.teacher?.teacherId || state.data?.teacherId}
						error={state.errors?.teacherId}
					/>
					<InputField
						type="number"
						label="Năm học"
						name={'year'}
						defaultValue={state.data?.year}
						error={state.errors?.year}
					/>
					<InputField
						type="number"
						label="Học kì"
						name={'semester'}
						defaultValue={state.data?.semester}
						error={state.errors?.semester}
					/>
					<InputField
						type="number"
						label="SL tối đa"
						name={'maxStudent'}
						defaultValue={state.data?.maxStudent}
						error={state.errors?.maxStudent}
					/>
					<InputField label="Phòng" name={'room'} defaultValue={state.data?.room} error={state.errors?.room} />
					<InputField
						label="Lịch học. (VD: Thứ 3, 10:00-11:00)"
						name={'schedule'}
						defaultValue={state.data?.schedule}
						error={state.errors?.schedule}
					/>
				</div>

				<button type="submit" className="rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</form>
		</div>
	)
}
