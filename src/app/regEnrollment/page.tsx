import EnrollmentForm from '@/components/forms/EnrollmentForm'
import prisma from '@/lib/prisma'

export default async function RegEnrollmentPage() {
	const relatedData = await prisma.class.findMany({
		include: {
			teacher: true,
			course: true,
			_count: {
				select: {
					Enrollment: true,
				},
			},
		},
	})

	// console.log(relatedData)

	return <EnrollmentForm relatedData={relatedData} />
}
