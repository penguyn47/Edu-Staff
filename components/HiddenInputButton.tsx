import { useState } from 'react'

export default function HiddenInputButton({
	children,
	isToggleable,
	toggleLabel,
	title,
}: {
	children: React.ReactNode
	isToggleable: boolean
	toggleLabel: string
	title: string
}) {
	const [isHidden, setHidden] = useState(true)

	const handleOnClick = () => {
		setHidden((prev) => !prev)
	}

	return (
		<div className="flex w-full flex-col items-start">
			<div className="flex items-center justify-center gap-2">
				<div className="mt-2 mb-2 text-xs">{title}</div>
				<input type="text" defaultValue={isHidden ? '' : 'y'} name={toggleLabel} hidden />

				{isHidden
					? isToggleable && (
							<button
								className="h-5 w-5 rounded bg-gray-800 text-center text-[12px] text-white hover:cursor-pointer hover:bg-gray-600"
								onClick={handleOnClick}
								type="button"
							>
								+
							</button>
						)
					: isToggleable && (
							<button
								className="h-5 w-5 rounded bg-gray-800 text-center text-[12px] text-white hover:cursor-pointer hover:bg-gray-600"
								onClick={handleOnClick}
								type="button"
							>
								-
							</button>
						)}
			</div>
			<div className="w-full">
				<div hidden={isHidden && isToggleable} className="ml-4">
					{children}
				</div>
			</div>
		</div>
	)
}
