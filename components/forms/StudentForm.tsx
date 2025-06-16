'use client'

import { createStudent, updateStudent } from '@/lib/actions'
import { Dispatch, SetStateAction, useActionState, useEffect, useRef, useState } from 'react'
import InputField from '../InputField'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import HiddenInputButton from '../HiddenInputButton'

import { STUDENT_STATUS_UPDATE_RULE } from '@/lib/settings'

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
		data: data,
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
								defaultValue={
									state.data?.dob instanceof Date ? state.data?.dob.toISOString().split('T')[0] : state.data?.dob
								}
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
								{state.errors?.sex && <div className="text-[10px] text-red-500">{state.errors?.sex}</div>}
							</div>
						</div>
						<div className="mx-4 mt-4 font-semibold">2. Thông tin liên lạc</div>
						<div className="mx-4 grid grid-cols-3 gap-2 gap-x-4">
							<div className="col-span-3">
								<input type="text" defaultValue={state.data?.permaAddressId} name="permaAddressId" hidden />
								<HiddenInputButton
									toggleLabel="includePermaAddress"
									title="Địa chỉ thường trú"
									isToggleable={!state.data?.permaAddressId}
									children={
										<div className="grid w-full grid-cols-3 gap-x-2">
											<InputField
												label="Số nhà"
												name={'permaAddressHouseNumber'}
												defaultValue={state.data?.permaAddressHouseNumber || state.data?.permaAddress?.houseNumber}
												error={state.errors?.permaAddressHouseNumber}
											/>
											<InputField
												label="Đường"
												name={'permaAddressStreet'}
												defaultValue={state.data?.permaAddressStreet || state.data?.permaAddress?.street}
												error={state.errors?.permaAddressStreet}
											/>
											<InputField
												label="Phường/xã"
												name={'permaAddressWard'}
												defaultValue={state.data?.permaAddressWard || state.data?.permaAddress?.ward}
												error={state.errors?.permaAddressWard}
											/>
											<InputField
												label="Quận/huyện"
												name={'permaAddressDistrict'}
												defaultValue={state.data?.permaAddressDistrict || state.data?.permaAddress?.district}
												error={state.errors?.permaAddressDistrict}
											/>
											<InputField
												label="Tỉnh/thành phố"
												name={'permaAddressCity'}
												defaultValue={state.data?.permaAddressCity || state.data?.permaAddress?.city}
												error={state.errors?.permaAddressCity}
											/>
											<InputField
												label="Quốc gia"
												name={'permaAddressCountry'}
												defaultValue={state.data?.permaAddressCountry || state.data?.permaAddress?.country}
												error={state.errors?.permaAddressCountry}
											/>
										</div>
									}
								/>
							</div>
							<div className="col-span-3">
								<input type="text" defaultValue={state.data?.tempAddressId} name="tempAddressId" hidden />
								<HiddenInputButton
									toggleLabel="includeTempAddress"
									title="Địa chỉ tạm trú"
									isToggleable={!state.data?.tempAddressId}
									children={
										<div className="grid w-full grid-cols-3 gap-x-2">
											<InputField
												label="Số nhà"
												name={'tempAddressHouseNumber'}
												defaultValue={state.data?.tempAddressHouseNumber || state.data?.tempAddress?.houseNumber}
												error={state.errors?.tempAddressHouseNumber}
											/>
											<InputField
												label="Đường"
												name={'tempAddressStreet'}
												defaultValue={state.data?.tempAddressStreet || state.data?.tempAddress?.street}
												error={state.errors?.tempAddressStreet}
											/>
											<InputField
												label="Phường/xã"
												name={'tempAddressWard'}
												defaultValue={state.data?.tempAddressWard || state.data?.tempAddress?.ward}
												error={state.errors?.tempAddressWard}
											/>
											<InputField
												label="Quận/huyện"
												name={'tempAddressDistrict'}
												defaultValue={state.data?.tempAddressDistrict || state.data?.tempAddress?.district}
												error={state.errors?.tempAddressDistrict}
											/>
											<InputField
												label="Tỉnh/thành phố"
												name={'tempAddressCity'}
												defaultValue={state.data?.tempAddressCity || state.data?.tempAddress?.city}
												error={state.errors?.tempAddressCity}
											/>
											<InputField
												label="Quốc gia"
												name={'tempAddressCountry'}
												defaultValue={state.data?.tempAddressCountry || state.data?.tempAddress?.country}
												error={state.errors?.tempAddressCountry}
											/>
										</div>
									}
								/>
							</div>
							<InputField
								label="Số điện thoại"
								name={'phone'}
								defaultValue={state.data?.phone}
								error={state.errors?.phone}
							/>
							<InputField label="Email" name={'email'} defaultValue={state.data?.email} error={state.errors?.email} />
							<InputField
								label="Mã bưu cục"
								name={'zipCode'}
								defaultValue={state.data?.zipCode}
								// error={state.errors?.zipCode}
							/>
							<InputField label="Quốc tịch" name={'nationality'} defaultValue={state.data?.nationality} />
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
								{state.errors?.faculty && <div className="text-[10px] text-red-500">{state.errors?.faculty}</div>}
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
								{state.errors?.program && <div className="text-[10px] text-red-500">{state.errors?.program}</div>}
							</div>
							<div className={'flex w-full flex-col gap-2'}>
								<label className="text-xs text-gray-500">Trạng thái</label>
								<select
									name="statusId"
									className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300"
									defaultValue={parseInt(data?.status?.id) || data?.statusId}
								>
									<option value="">Chọn trạng thái</option>
									{relatedData?.studentStatuses.map((item: { id: number; name: string }, index: number) => {
										const currentIndex = STUDENT_STATUS_UPDATE_RULE.indexOf(data?.status?.name || 'MAX')
										return (
											<option
												key={item.id}
												value={item.id}
												disabled={currentIndex > STUDENT_STATUS_UPDATE_RULE.indexOf(item.name)}
											>
												{item.name}
											</option>
										)
									})}
								</select>
								{state.errors?.status && <div className="text-[10px] text-red-500">{state.errors?.status}</div>}
							</div>
						</div>
						<div className="mx-4 mt-4 font-semibold">4. Giấy tờ chứng thân</div>
						<div className="col-span-3 mx-4">
							<input type="text" defaultValue={state.data?.cmnd?.id} name="cmndId" hidden />
							<HiddenInputButton
								toggleLabel="includecmnd"
								title="Chứng minh nhân dân"
								isToggleable={!state.data?.cmndId}
								children={
									<div className="grid w-full grid-cols-3 gap-x-2">
										<InputField
											label="Số CMND"
											name={'cmndNumber'}
											defaultValue={state.data?.cmndNumber || state.data?.cmnd?.number}
											error={state.errors?.cmndNumber}
										/>
										<InputField
											type="date"
											label="Ngày cấp"
											name={'cmndIssueDate'}
											defaultValue={
												state.data?.cmndIssueDate instanceof Date
													? state.data?.cmndIssueDate.toISOString().split('T')[0]
													: state.data?.cmndIssueDate || state.data?.cmnd?.issueDate.toISOString().split('T')[0]
											}
											error={state.errors?.cmndIssueDate}
										/>
										<InputField
											type="date"
											label="Ngày hết hạn"
											name={'cmndExpiryDate'}
											defaultValue={
												state.data?.cmndExpiryDate instanceof Date
													? state.data?.cmndExpiryDate.toISOString().split('T')[0]
													: state.data?.cmndExpiryDate || state.data?.cmnd?.expiryDate.toISOString().split('T')[0]
											}
											error={state.errors?.cmndExpiryDate}
										/>
										<div className="col-span-2">
											<InputField
												label="Nơi cấp"
												name={'cmndIssuePlace'}
												defaultValue={state.data?.cmndIssuePlace || state.data?.cmnd?.issuePlace}
												error={state.errors?.cmndIssuePlace}
											/>
										</div>
									</div>
								}
							/>
							<HiddenInputButton
								toggleLabel="includecccd"
								title="Căn cước công dân"
								isToggleable={!state.data?.cccdId}
								children={
									<div className="grid w-full grid-cols-3 gap-x-2">
										<input type="text" defaultValue={state.data?.cccd?.id} name="cccdId" hidden />
										<InputField
											label="Số CCCD"
											name={'cccdNumber'}
											defaultValue={state.data?.cccdNumber || state.data?.cccd?.number}
											error={state.errors?.cccdNumber}
										/>
										<InputField
											type="date"
											label="Ngày cấp"
											name={'cccdIssueDate'}
											defaultValue={
												state.data?.cccdIssueDate instanceof Date
													? state.data?.cccdIssueDate.toISOString().split('T')[0]
													: state.data?.cccdIssueDate || state.data?.cccd?.issueDate.toISOString().split('T')[0]
											}
											error={state.errors?.cccdIssueDate}
										/>
										<InputField
											type="date"
											label="Ngày hết hạn"
											name={'cccdExpiryDate'}
											defaultValue={
												state.data?.cccdExpiryDate instanceof Date
													? state.data?.cccdExpiryDate.toISOString().split('T')[0]
													: state.data?.cccdExpiryDate || state.data?.cccd?.expiryDate.toISOString().split('T')[0]
											}
											error={state.errors?.cccdExpiryDate}
										/>
										<div className="col-span-2">
											<InputField
												label="Nơi cấp"
												name={'cccdIssuePlace'}
												defaultValue={state.data?.cccdIssuePlace || state.data?.cccd?.issuePlace}
												error={state.errors?.cccdIssuePlace}
											/>
										</div>
										<InputField
											type="checkbox"
											label="Có gắn chip?"
											name={'cccdHasChip'}
											defaultChecked={state.data?.cccdHasChip || state.data?.cccd?.hasChip}
											error={state.errors?.cccdHasChip}
										/>
									</div>
								}
							/>
							<HiddenInputButton
								toggleLabel="includepassport"
								title="Hộ chiếu"
								isToggleable={!state.data?.passportId}
								children={
									<div className="grid w-full grid-cols-3 gap-x-2">
										<input type="text" defaultValue={state.data?.passport?.id} name="passportId" hidden />
										<InputField
											label="Số Hộ chiếu"
											name={'passportNumber'}
											defaultValue={state.data?.passportNumber || state.data?.passport?.number}
											error={state.errors?.passportNumber}
										/>
										<InputField
											type="date"
											label="Ngày cấp"
											name={'passportIssueDate'}
											defaultValue={
												state.data?.passportIssueDate instanceof Date
													? state.data?.passportIssueDate.toISOString().split('T')[0]
													: state.data?.passportIssueDate || state.data?.passport?.issueDate.toISOString().split('T')[0]
											}
											error={state.errors?.passportIssueDate}
										/>
										<InputField
											type="date"
											label="Ngày hết hạn"
											name={'passportExpiryDate'}
											defaultValue={
												state.data?.passportExpiryDate instanceof Date
													? state.data?.passportExpiryDate.toISOString().split('T')[0]
													: state.data?.passportExpiryDate ||
														state.data?.passport?.expiryDate.toISOString().split('T')[0]
											}
											error={state.errors?.passportExpiryDate}
										/>
										<div className="col-span-2">
											<InputField
												label="Nơi cấp"
												name={'passportIssuePlace'}
												defaultValue={state.data?.passportIssuePlace || state.data?.passport?.issuePlace}
												error={state.errors?.passportIssuePlace}
											/>
										</div>
										<InputField
											label="Quốc gia cấp"
											name={'passportIssuingCountry'}
											defaultValue={state.data?.passportIssuingCountry || state.data?.passport?.issuingCountry}
											error={state.errors?.passportIssuingCountry}
										/>
										<InputField
											label="Ghi chú"
											name={'passportNotes'}
											defaultValue={state.data?.passportNotes || state.data?.passport?.notes}
											error={state.errors?.passportNotes}
										/>
									</div>
								}
							/>
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
