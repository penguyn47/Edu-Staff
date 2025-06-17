import { PiStudentFill } from 'react-icons/pi'
import Link from 'next/link'

export default function Navbar() {
	return (
		<div className="flex flex-col">
			<div className="mx-16 flex justify-between border-b-2 border-gray-400 py-2 text-2xl">
				<div className="flex items-center gap-4">
					<PiStudentFill className="text-4xl" />
					<Link href={'/'}>
						<div className="text-2xl font-bold">Edu Staff</div>
					</Link>
				</div>
				<div className="flex gap-2 text-xl">
					<Link href={'/list/students'}>
						<div className="rounded-sm border px-2 py-1 select-none hover:cursor-pointer hover:bg-gray-200">
							Sinh viên
						</div>
					</Link>
					<Link href={'/list/teachers'}>
						<div className="rounded-sm border px-2 py-1 select-none hover:cursor-pointer hover:bg-gray-200">
							Giảng viên
						</div>
					</Link>
					<Link href={'/list/courses'}>
						<div className="rounded-sm border px-2 py-1 select-none hover:cursor-pointer hover:bg-gray-200">
							Khóa học
						</div>
					</Link>
				</div>
			</div>
			<div className="mx-16 mb-2 flex justify-end gap-2 pb-2">
				<Link href={'/list/faculties'}>
					<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
						Khoa
					</div>
				</Link>
				<Link href={'/list/programs'}>
					<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
						Chương trình
					</div>
				</Link>
				<Link href={'/list/studentStatuses'}>
					<div className="mt-2 rounded-sm border px-2 py-1 text-sm select-none hover:cursor-pointer hover:bg-gray-200">
						Trạng thái
					</div>
				</Link>
			</div>
		</div>
	)
}
