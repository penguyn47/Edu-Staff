'use client'

import { createEnrollment, createStudent } from '@/lib/actions'
import { useActionState, useEffect } from 'react'
import InputField from '../InputField'
import { Table } from '../ui/Table'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const columns = [
	{ header: '', accessor: 'input', className: '' },
	{ header: 'Môn', accessor: 'courseName', className: 'px-2 py-1' },
	{ header: 'Mã lớp', accessor: 'classId', className: 'px-2 py-1' },
	{ header: 'SL tối đa', accessor: 'maxStudent', className: 'px-2 py-1' },
	{ header: 'SL đã đăng ký', accessor: 'countStudent', className: 'px-2 py-1' },
	{ header: 'Phòng', accessor: 'room', className: 'px-2 py-1' },
	{ header: 'Lịch', accessor: 'schedule', className: 'px-2 py-1' },
]

export default function EnrollmentForm({ relatedData }: { relatedData: any }) {
	const renderRow = (item: any) => (
		<tr key={item.id}>
			<td className="px-2 py-1">
				<input type="checkbox" name={`class[${item.classId}]`} />
			</td>
			<td className="px-2 py-1">{item?.course?.name}</td>
			<td className="px-2 py-1">{item.classId}</td>
			<td className="px-2 py-1">{item.maxStudent}</td>
			<td className="px-2 py-1">{item?._count.Enrollment}</td>
			<td className="px-2 py-1">{item.room}</td>
			<td className="px-2 py-1">{item.schedule}</td>
		</tr>
	)
	const [state, formAction] = useActionState(createEnrollment, {
		success: false,
		error: false,
		errors: null,
		data: null,
		successes: null,
	})

	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			toast(`Đăng ký môn thành công`)
			router.refresh()
		}
	}, [state])

	return (
		<div className="flex flex-col items-center justify-center px-20">
			<form action={formAction} className="flex flex-col gap-4">
				<div className="w-fit">
					<InputField
						label="Sinh viên (MSSV)"
						name={'studentId'}
						error={state.errors?.studentId}
						defaultValue={state?.data?.studentId}
					/>
				</div>
				<Table columns={columns} renderRow={renderRow} data={relatedData} />

				<button type="submit">
					<div className="mt-2 w-fit rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
						Đăng ký
					</div>
				</button>
				<div className="font-bold">
					Thông báo:
					<div className="text-red-500">
						{state.errors?.summary &&
							state.errors?.summary.map((item: any, index: any) => <div key={index}> {item} </div>)}
					</div>
					<div className="text-green-600">
						{state.successes?.summary &&
							state.successes?.summary.map((item: any, index: any) => <div key={index}> {item} </div>)}
					</div>
				</div>
			</form>
		</div>
	)
}
