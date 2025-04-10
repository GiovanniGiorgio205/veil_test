import { MainHeader } from '@/components/main-header'

export default function WorkspacesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section className="flex flex-col min-h-svh">
			<MainHeader />
			{children}
		</section>
	)
}
