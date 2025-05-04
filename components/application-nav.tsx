import { AppNav } from '@/lib/app-nav'
import { UserApplications } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function ApplicationNavBar({
	app = null,
	tenant = '',
}: {
	app: UserApplications
	tenant: string
}) {
	const router = useRouter()

	return (
		<div className="bg-background/25 backdrop-blur-sm z-40 w-full border-b flex justify-center">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex gap-1">
					{AppNav.map((x) => (
						<Button
							key={x.key}
							variant={'outline'}
							onClick={() => {
								router.push(`../../../${tenant}/${app.ID}${x.link}`)
							}}
							size={'sm'}
							className="p-0"
						>
							<x.icon />
							{x.title}
						</Button>
					))}
				</div>
				<div className="flex flex-1 items-center justify-end space-x-4 ">
					<p className="text-lg font-bold">{app?.ApplicationName}</p>
				</div>
			</div>
		</div>
	)
}
