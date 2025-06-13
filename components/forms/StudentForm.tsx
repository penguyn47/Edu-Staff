'use client'

import { createStudent, updateStudent } from '@/lib/actions'
import { Dispatch, SetStateAction, useActionState, useEffect, useRef, useState } from 'react'
import InputField from '../InputField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

export default function StudentForm({
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

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Student has been ${type === 'create' ? 'created' : 'updated'}!`)
			setOpen(false)
			router.refresh()
		}
		if (state.error) {
			toast.error(`Something went wrong!`)
		}
	}, [state])

	return (
		<div>
			<form className="flex flex-col gap-2" action={formAction}>
				<h1 className="mx-4 text-xl font-semibold">{type === 'create' ? 'Tạo mới sinh viên' : 'Cập nhật sinh viên'}</h1>
				<div className="grid grid-cols-2">
					<div className="border-r-2">
						<div className="mx-4 font-semibold">1. Thông tin cá nhân</div>
						<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
							<InputField
								label="MSSV"
								name={'studentId'}
								defaultValue={state.data?.studentId}
								error={state.errors?.studentId}
								inputProps={{ readOnly: type === 'create' ? false : true }}
							/>
							<div className="col-span-2">
								<InputField label="Họ tên" name={'name'} defaultValue={state.data?.name} error={state.errors?.name} />
							</div>
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
									id="select-sex"
									name="sex"
									className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
									defaultValue={data?.sex}
								>
									<option value="">Chọn giới tính</option>
									<option value="MALE">Nam</option>
									<option value="FEMALE">Nữ</option>
								</select>
							</div>
						</div>
						<div className="mx-4 mt-4 font-semibold">2. Thông tin liên lạc</div>
						<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
							<div className="col-span-2">
								<InputField
									label="Địa chỉ"
									name={'address'}
									defaultValue={state.data?.address}
									error={state.errors?.address}
								/>
							</div>
							<InputField
								label="Số điện thoại"
								name={'phone'}
								defaultValue={state.data?.phone}
								error={state.errors?.phone}
							/>
							<div className="col-span-2">
								<InputField label="Email" name={'email'} defaultValue={state.data?.email} error={state.errors?.email} />
							</div>
						</div>
					</div>
					<div>
						<div className="mx-4 mt-4 font-semibold">3. Thông tin học vấn</div>
						<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
							<InputField
								label="Niên khóa"
								name={'cohort'}
								type="number"
								defaultValue={state.data?.cohort}
								error={state.errors?.cohort}
							/>

							<div className={'col-span-2 flex w-full flex-col gap-2'}>
								<label className="text-xs text-gray-500">Khoa</label>
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
								{state.errors?.status && <div className="text-sm text-red-500">{state.errors?.status}</div>}
							</div>

							<div className={'col-span-2 flex w-full flex-col gap-2'}>
								<label className="text-xs text-gray-500">Chương trình</label>
								<select
									name="programId"
									className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
									defaultValue={data?.programId}
								>
									<option value="">Chọn chương trình</option>
									{relatedData?.programs.map((item: { id: number; name: string }, index: number) => (
										<option key={item.id} value={item.id}>
											{item.name}
										</option>
									))}
								</select>
								{state.errors?.status && <div className="text-sm text-red-500">{state.errors?.status}</div>}
							</div>
							<div className={'flex w-full flex-col gap-2'}>
								<label className="text-xs text-gray-500">Trạng thái</label>
								<select
									name="statusId"
									className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
									defaultValue={data?.statusId}
								>
									<option value="">Chọn trạng thái</option>
									{relatedData?.studentStatuses.map((item: { id: number; name: string }, index: number) => (
										<option key={item.id} value={item.id}>
											{item.name}
										</option>
									))}
								</select>
								{state.errors?.status && <div className="text-sm text-red-500">{state.errors?.status}</div>}
							</div>
						</div>
					</div>
				</div>

				<button type="submit" className="mt-4 rounded-md bg-gray-700 p-2 text-white hover:cursor-pointer">
					{type === 'create' ? 'Thêm mới' : 'Cập nhật'}
				</button>
			</form>
		</div>
	)
}
