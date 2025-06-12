import Navbar from '@/components/ui/Navbar'
import '@/src/app/global.css'
import { ToastContainer } from 'react-toastify'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Navbar />
				<main>{children}</main>
				<ToastContainer theme="dark" position="bottom-right" />
			</body>
		</html>
	)
}
