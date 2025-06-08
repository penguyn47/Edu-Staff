import { PiStudentFill } from 'react-icons/pi'

export default function Navbar() {
	return (
		<div className="mx-16 flex justify-between border-b-2 border-gray-400 py-2 text-2xl">
			<div className="flex items-center gap-4">
				<PiStudentFill className="text-4xl" />
				<div className="text-2xl font-bold">Edu Staff</div>
			</div>
			<div className="text-xl">
				<div className="rounded-sm px-2 py-1 select-none hover:cursor-pointer hover:bg-gray-200">Sinh viên</div>
			</div>
		</div>
	)
}
