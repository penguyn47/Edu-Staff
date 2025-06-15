import { Identification } from '@prisma/client'
import Image from 'next/image'

export default function IdentificationCard({ data }: { data: Identification }) {
	return (
		<div>
			<div>{data.type}</div>
		</div>
	)
}
