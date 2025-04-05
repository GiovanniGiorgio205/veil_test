import { MainHeader } from '@/components/main-header'

export default function WorkspacesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section>
			<MainHeader />
			{children}
		</section>
	)
}
