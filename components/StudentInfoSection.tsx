import prisma from '@/lib/prisma'
import Image from 'next/image'
import FormModal from './FormModal'
import { CiEdit } from 'react-icons/ci'

export default async function StudentInfoSection({ data }: { data: any }) {
	const [faculties, programs, studentStatuses] = await prisma.$transaction([
		prisma.faculty.findMany(),
		prisma.program.findMany(),
		prisma.studentStatus.findMany(),
	])

	const relatedData = {
		faculties: faculties,
		programs: programs,
		studentStatuses: studentStatuses,
	}

	return (
		<div className="flex w-full items-center justify-around border px-10 py-8">
			<div className="flex w-1/3 min-w-[200px] flex-col items-center justify-center gap-2">
				{data?.sex == 'MALE' ? (
					<Image width={200} height={200} alt="avatar" src="/boy.png" className="h-[200px] w-[200px] rounded-full" />
				) : (
					<Image width={200} height={200} alt="avatar" src="/girl.png" className="h-[200px] w-[200px] rounded-full" />
				)}
				<div className="text-sl font-bold">{data?.name}</div>
				<div className="text-sl">{data?.studentId}</div>
				<FormModal
					tableName="student"
					type="update"
					data={data}
					relatedData={relatedData}
					children={
						<div className="rounded-sm bg-gray-200 px-1 py-1 text-center text-xl hover:cursor-pointer hover:bg-gray-300">
							<CiEdit />
						</div>
					}
				/>
			</div>
			<div className="grid w-2/3 grid-cols-5">
				<div className="">
					<div className="text-xl font-bold">1. Thông tin cơ bản</div>
					<div>
						<div>
							{' '}
							-<span className="font-semibold"> Khóa: </span>
							{data?.cohort}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> Khoa: </span>
							{data?.faculty?.name}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> Chương trình: </span>
							{data?.program?.name}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> Tình trạng: </span>
							{data?.status?.name}
						</div>
					</div>
				</div>

				<div className="col-span-2">
					<div className="text-xl font-bold">2. Thông tin cá nhân</div>
					<div>
						<div>
							{' '}
							-<span className="font-semibold"> Tên: </span>
							{data?.name}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> Email: </span>
							{data?.email}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> SĐT: </span>
							{data?.phone}
						</div>
						<div>
							{' '}
							-<span className="font-semibold"> Ngày sinh: </span>
							{data?.dob.toLocaleDateString()}
						</div>
					</div>
					{!data?.permaAddress && !data?.tempAddress && <div>Không có thông tin địa chỉ cư trú</div>}
					{data?.permaAddress && (
						<div className="flex flex-col items-start justify-center px-2 py-1">
							<div className="underline">Địa chỉ thường trú</div>
							<div className="grid grid-cols-2 gap-x-2">
								<div>
									<span className="font-semibold"> Số nhà: </span>
									{data?.permaAddress?.houseNumber}
								</div>
								<div>
									<span className="font-semibold"> Đường: </span>
									{data?.permaAddress?.street}
								</div>
								<div>
									<span className="font-semibold"> Phường/xã: </span>
									{data?.permaAddress?.ward}
								</div>
								<div>
									<span className="font-semibold"> Quận/huyện: </span>
									{data?.permaAddress?.district}
								</div>
								<div>
									<span className="font-semibold"> Tỉnh/thành phố: </span>
									{data?.permaAddress?.city}
								</div>
								<div>
									<span className="font-semibold"> Quốc gia: </span>
									{data?.permaAddress?.country}
								</div>
							</div>
						</div>
					)}
					{data?.tempAddress && (
						<div className="flex flex-col items-start justify-center px-2 py-1">
							<div className="underline">Địa chỉ tạm trú</div>
							<div className="grid grid-cols-2 gap-x-2">
								<div>
									<span className="font-semibold"> Số nhà: </span>
									{data?.tempAddress?.houseNumber}
								</div>
								<div>
									<span className="font-semibold"> Đường: </span>
									{data?.tempAddress?.street}
								</div>
								<div>
									<span className="font-semibold"> Phường/xã: </span>
									{data?.tempAddress?.ward}
								</div>
								<div>
									<span className="font-semibold"> Quận/huyện: </span>
									{data?.tempAddress?.district}
								</div>
								<div>
									<span className="font-semibold"> Tỉnh/thành phố: </span>
									{data?.tempAddress?.city}
								</div>
								<div>
									<span className="font-semibold"> Quốc gia: </span>
									{data?.tempAddress?.country}
								</div>
							</div>
						</div>
					)}
				</div>

				<div className="col-span-2">
					<div className="text-xl font-bold">3. Thông tin chứng thân</div>
					{!data?.cccd && !data?.cmnd && !data?.passport && <div>Không có thông tin chứng thân</div>}
					{data?.cccd && (
						<div className="flex flex-col items-start justify-center px-2 py-1">
							<div className="underline">Căn cước công dân</div>
							<div className="grid grid-cols-2 gap-x-2">
								<div>
									<span className="font-semibold"> Số CCCD: </span>
									{data?.cccd?.number}
								</div>
								<div>
									<span className="font-semibold"> Ngày cấp: </span>
									{data?.cccd?.issueDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Hết hạn: </span>
									{data?.cccd?.expiryDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Nơi cấp: </span>
									{data?.cccd?.issuePlace}
								</div>
								<div>
									<span className="font-semibold"> Có chip?: </span>
									{data?.cccd?.hasChip ? 'Có' : 'Không'}
								</div>{' '}
							</div>
						</div>
					)}
					{data?.cmnd && (
						<div className="flex flex-col items-start justify-center px-2 py-1">
							<div className="underline">Chứng minh nhân dân</div>
							<div className="grid grid-cols-2 gap-x-2">
								<div>
									<span className="font-semibold"> Số CMND: </span>
									{data?.cmnd?.number}
								</div>
								<div>
									<span className="font-semibold"> Ngày cấp: </span>
									{data?.cmnd?.issueDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Hết hạn: </span>
									{data?.cmnd?.expiryDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Nơi cấp: </span>
									{data?.cmnd?.issuePlace}
								</div>{' '}
							</div>
						</div>
					)}
					{data?.passport && (
						<div className="flex flex-col items-start justify-center px-2 py-1">
							<div className="underline">Hộ chiếu</div>
							<div className="grid grid-cols-2 gap-x-2">
								<div>
									<span className="font-semibold"> Số hộ chiếu: </span>
									{data?.passport?.number}
								</div>
								<div>
									<span className="font-semibold"> Ngày cấp: </span>
									{data?.passport?.issueDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Hết hạn: </span>
									{data?.passport?.expiryDate?.toLocaleDateString()}
								</div>
								<div>
									<span className="font-semibold"> Nơi cấp: </span>
									{data?.passport?.issuePlace}
								</div>
								<div>
									<span className="font-semibold"> Quốc gia cấp: </span>
									{data?.passport?.issuingCountry}
								</div>
								<div>
									<span className="font-semibold"> Ghi chú: </span>
									{data?.passport?.notes}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
