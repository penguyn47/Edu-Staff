type InputFieldProps = {
	label: string
	type?: string
	name: string
	defaultValue?: string
	error?: string
	hidden?: boolean
	inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default function InputField({
	label,
	type = 'text',
	name,
	defaultValue,
	error,
	hidden,
	inputProps,
}: InputFieldProps) {
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
			{error && <div className="text-sm text-red-500">{error}</div>}
		</div>
	)
}
