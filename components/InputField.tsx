type InputFieldProps = {
	label: string
	type?: string
	name: string
	defaultValue?: string
	defaultChecked?: boolean
	error?: string
	hidden?: boolean
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default function InputField({
	label,
	type = 'text',
	name,
	defaultValue,
	defaultChecked,
	error,
	hidden,
	inputProps,
}: InputFieldProps) {
	if (type == 'checkbox')
		return (
			<div>
				<div className={hidden ? 'hidden' : 'flex w-full flex-col justify-center'}>
					<label className="mt-2 mb-2 text-xs text-gray-500">{label}</label>
					<input
						type={type}
						name={name}
						className="mb-2 h-4"
						{...inputProps}
						defaultChecked={defaultChecked}
						defaultValue={defaultValue}
					/>
					{error && <div className="text-[10px] text-red-500">{error}</div>}
				</div>
			</div>
		)

	return (
		<div className={hidden ? 'hidden' : 'flex w-full flex-col'}>
			<label className="mb-2 text-xs text-gray-500">{label}</label>
			<input
				type={type}
				name={name}
				className="w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300 read-only:bg-gray-200 read-only:hover:cursor-not-allowed"
				{...inputProps}
				defaultValue={defaultValue}
			/>
			{error && <div className="mt-2 text-[10px] text-red-500">{error}</div>}
		</div>
	)
}
