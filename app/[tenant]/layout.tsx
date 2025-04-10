import { MainHeader } from '@/components/main-header'

export default function TenantLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<section className="flex flex-col min-h-svh">
			<MainHeader /> {children}
		</section>
	)
}
