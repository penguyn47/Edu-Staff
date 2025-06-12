'use client'

import { createStudent, updateStudent } from '@/lib/actions'
import { Dispatch, SetStateAction, useActionState, useEffect } from 'react'
import InputField from '../InputField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function StudentForm({
	type,
	data,
	setOpen,
}: {
	type: 'create' | 'update'
	data?: any
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const [state, formAction] = useActionState(type === 'create' ? createStudent : updateStudent, {
		success: false,
		error: false,
		errors: null,
		data: data
			? {
					...data,
					dob: data.dob instanceof Date ? data.dob.toISOString().split('T')[0] : data.dob,
				}
			: null,
	})

	console.log(state.data)

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Student has been ${type === 'create' ? 'created' : 'updated'}!`)
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
				<h1 className="mx-4 text-xl font-semibold">{type === 'create' ? 'Tạo mới sinh viên' : 'Cập nhật sinh viên'}</h1>
				<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
					<InputField
						label="MSSV"
						name={'studentId'}
						defaultValue={state.data?.studentId}
						error={state.errors?.studentId}
						inputProps={{ readOnly: type === 'create' ? false : true }}
					/>
					<InputField label="Họ tên" name={'name'} defaultValue={state.data?.name} error={state.errors?.name} />
					<InputField
						label="Ngày sinh"
						name={'dob'}
						type="date"
						defaultValue={state.data?.dob}
						error={state.errors?.dob}
					/>
					<div className={'flex w-full flex-col gap-2'}>
						<label className="text-xs text-gray-500">Giới tính</label>
						<select
							name="sex"
							className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
							defaultValue={state.data?.sex}
						>
							<option value="MALE">Nam</option>
							<option value="FEMALE">Nữ</option>
						</select>
						{state.errors?.sex && <div className="text-sm text-red-500">{state.errors?.sex}</div>}
					</div>
					<InputField label="Khoa" name={'faculty'} defaultValue={state.data?.faculty} error={state.errors?.faculty} />
					<InputField
						label="Niên khóa"
						name={'cohort'}
						type="number"
						defaultValue={state.data?.cohort}
						error={state.errors?.cohort}
					/>
					<InputField
						label="Chương trình"
						name={'program'}
						defaultValue={state.data?.program}
						error={state.errors?.program}
					/>
					<InputField
						label="Địa chỉ"
						name={'address'}
						defaultValue={state.data?.address}
						error={state.errors?.address}
					/>
					<InputField
						label="Số điện thoại"
						name={'phone'}
						defaultValue={state.data?.phone}
						error={state.errors?.phone}
					/>
					<InputField label="Email" name={'email'} defaultValue={state.data?.email} error={state.errors?.email} />
					<div className={'flex w-full flex-col gap-2'}>
						<label className="text-xs text-gray-500">Trạng thái</label>
						<select
							name="status"
							className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
							defaultValue={state.data?.status}
						>
							<option value="ACTIVE">Đang học</option>
							<option value="GRADUATED">Đã tốt nghiệp</option>
							<option value="SUSPENDED">Tạm dừng</option>
							<option value="WITHDRAWN">Thôi học</option>
						</select>
						{state.errors?.status && <div className="text-sm text-red-500">{state.errors?.status}</div>}
					</div>
				</div>

				<button type="submit" className="rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</form>
		</div>
	)
}
