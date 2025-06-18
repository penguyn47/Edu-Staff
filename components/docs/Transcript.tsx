'use client'

import { useReactToPrint } from 'react-to-print'
import { useRef } from 'react'

export default function Transcript({ studentData, resultData }: { studentData: any; resultData: any }) {
	const contentRef = useRef<HTMLDivElement>(null)
	const reactToPrintFn = useReactToPrint({ contentRef })

	const calculateGPA = (results: any) => {
		if (!results || results.length === 0) return 0
		const totalCredits = results.reduce((sum: any, result: any) => sum + result.credits, 0)
		const weightedSum = results.reduce((sum: any, result: any) => sum + result.grade * result.credits, 0)
		return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0
	}

	const gpa = calculateGPA(resultData)

	const formatDate = (date: any) => {
		return date ? new Date(date).toLocaleDateString('vi-VN') : 'N/A'
	}

	return (
		<div className="flex flex-col items-center">
			<div
				className="w-fit rounded-sm border px-2 py-1 select-none hover:cursor-pointer hover:bg-gray-200"
				onClick={reactToPrintFn}
			>
				In kết quả học tập
			</div>
			<div ref={contentRef}>
				<div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-6 lg:px-8">
					<div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
						{/* Header */}
						<div className="bg-gray-800 bg-gradient-to-r py-6 text-center text-white">
							<h1 className="text-3xl font-bold">Bảng Điểm Sinh Viên</h1>
							<p className="mt-1 text-sm">Trường Đại học XYZ</p>
						</div>

						{/* Student Information */}
						<div className="border-b border-gray-200 p-6">
							<h2 className="mb-4 text-2xl font-semibold text-gray-800">Thông Tin Sinh Viên</h2>
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								<div>
									<p className="text-gray-600">
										<span className="font-medium">Mã SV:</span> {studentData.studentId}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Họ Tên:</span> {studentData.name}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Ngày Sinh:</span> {formatDate(studentData.dob)}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Giới Tính:</span> {studentData.sex === 'MALE' ? 'Nam' : 'Nữ'}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Quốc Tịch:</span> {studentData.nationality}
									</p>
								</div>
								<div>
									<p className="text-gray-600">
										<span className="font-medium">Khoa:</span> {studentData.faculty.name}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Chương Trình:</span> {studentData.program.name}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Trạng Thái:</span> {studentData.status.name}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">Email:</span> {studentData.email || 'N/A'}
									</p>
									<p className="text-gray-600">
										<span className="font-medium">SĐT:</span> {studentData.phone || 'N/A'}
									</p>
								</div>
							</div>
						</div>

						{/* Grades Table */}
						<div className="p-6">
							<h2 className="mb-4 text-2xl font-semibold text-gray-800">Kết Quả Học Tập</h2>
							{resultData && resultData.length > 0 ? (
								<div className="overflow-x-auto">
									<table className="min-w-full rounded-lg border border-gray-200 bg-white">
										<thead className="bg-gray-50">
											<tr>
												<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mã HP</th>
												<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tên Học Phần</th>
												<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số Tín Chỉ</th>
												<th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Điểm</th>
											</tr>
										</thead>
										<tbody>
											{resultData.map((result: any, index: any) => (
												<tr
													key={result.courseId}
													className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition hover:bg-blue-50`}
												>
													<td className="px-4 py-3 text-sm text-gray-600">{result.course.courseId}</td>
													<td className="px-4 py-3 text-sm text-gray-600">{result.course.name}</td>
													<td className="px-4 py-3 text-sm text-gray-600">{result.credits}</td>
													<td className="px-4 py-3 text-sm text-gray-600">{result.grade.toFixed(2)}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<p className="text-gray-600">Chưa có kết quả học tập.</p>
							)}
						</div>

						{/* GPA */}
						<div className="border-t border-gray-200 bg-gray-50 p-6">
							<h3 className="text-xl font-semibold text-gray-800">Điểm Trung Bình Tích Lũy (GPA):</h3>
							<p className="mt-2 text-3xl font-bold text-gray-600">{gpa}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
