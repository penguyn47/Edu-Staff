'use client'

import { Dispatch, ReactNode, SetStateAction, useActionState, useEffect, useState } from 'react'
import { deleteStudent, deleteFaculty, deleteProgram, deleteStudentStatus, deleteTeacher } from '@/lib/actions'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import StudentForm from './forms/StudentForm'
import FacultyForm from './forms/FacultyForm'
import ProgramForm from './forms/ProgramForm'
import StudentStatusForm from './forms/StudentStatusForm'
import ExportForm from './forms/ExportForm'
import TeacherForm from './forms/TeacherForm'

const deleteActionMap = {
	student: deleteStudent,
	faculty: deleteFaculty,
	program: deleteProgram,
	studentstatus: deleteStudentStatus,
	export: deleteProgram,
	teacher: deleteTeacher,
}

const forms: {
	[key: string]: (
		setOpen: Dispatch<SetStateAction<boolean>>,
		type: 'create' | 'update',
		data?: any,
		relatedData?: any,
	) => ReactNode
} = {
	student: (setOpen, type, data, relatedData) => (
		<StudentForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
	faculty: (setOpen, type, data, relatedData) => (
		<FacultyForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
	program: (setOpen, type, data, relatedData) => (
		<ProgramForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
	studentstatus: (setOpen, type, data, relatedData) => (
		<StudentStatusForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
	export: (setOpen, type, data, relatedData) => (
		<ExportForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
	teacher: (setOpen, type, data, relatedData) => (
		<TeacherForm setOpen={setOpen} type={type} data={data} relatedData={relatedData} />
	),
}

export default function FormModal({
	type,
	tableName,
	data,
	id,
	children,
	relatedData,
}: {
	type: 'create' | 'update' | 'delete' | 'import' | 'export'
	tableName: 'student' | 'faculty' | 'program' | 'studentstatus' | 'export' | 'teacher'
	data?: any
	id?: number
	children: ReactNode
	relatedData?: any
}) {
	const [isOpen, setOpen] = useState(false)

	const Form = () => {
		const [state, formAction] = useActionState(deleteActionMap[tableName], {
			success: false,
			error: false,
		})

		const router = useRouter()

		useEffect(() => {
			if (state.success) {
				toast(`${tableName} has been deleted!`)
				setOpen(false)
				router.refresh()
			}
		}, [state, router])

		return type === 'delete' && id ? (
			<div>
				<h1 className="mx-4 text-xl font-semibold">Xóa {tableName}</h1>
				<form action={formAction} className="flex flex-col gap-4 p-4">
					<input type="text | number" name="id" defaultValue={id} hidden />
					<span className="text-center font-medium">Dữ liệu sẽ bị xóa vĩnh viễn. Bạn có chắc sẽ xóa {tableName} ?</span>
					<button className="w-max self-center rounded-md border-none bg-rose-600 px-4 py-2 text-white hover:cursor-pointer hover:bg-red-800">
						Xác nhận xóa
					</button>
				</form>
			</div>
		) : type === 'create' || type === 'update' ? (
			forms[tableName](setOpen, type, data, relatedData)
		) : (
			'Form not found!'
		)
	}

	return (
		<div>
			<div>
				<button onClick={() => setOpen(true)}>{children}</button>
			</div>
			{isOpen && (
				<div>
					<div className="absolute top-0 left-0 z-40 flex min-h-screen min-w-screen items-center justify-center bg-gray-900/50 px-6 py-4">
						<div className="relative rounded bg-white px-2 py-4">
							<div className="absolute top-2 right-4 hover:cursor-pointer" onClick={() => setOpen(false)}>
								✖️
							</div>
							<Form />
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
