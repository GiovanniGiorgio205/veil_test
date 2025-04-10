'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { ChevronRight, PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WorkspacesPage() {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<section className="w-full flex justify-center py-8">
			<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
				<h1 className="text-3xl font-bold">Workspaces</h1>
				<small className="text-sm text-muted-foreground leading-none">
					Some placeholder
				</small>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
					{user?.Workspaces.map((workspace) => (
						<Card key={workspace.ID}>
							<CardHeader>
								<CardTitle>{workspace.name}</CardTitle>
								<CardDescription>{workspace.tenant}</CardDescription>
								<CardContent className="px-0 h-[45px]">
									<p>{workspace.description}</p>
								</CardContent>
								<CardFooter className="px-0">
									<Button
										className="w-full"
										variant={'outline'}
										onClick={() => router.push(`/${workspace.tenant}`)}
									>
										Open
										<ChevronRight />
									</Button>
								</CardFooter>
							</CardHeader>
						</Card>
					))}
					<Button
						variant={'outline'}
						className="flex flex-col gap-2 h-[150px] rounded-2xl"
						onClick={() => {
							router.push('/workspaces/create')
						}}
					>
						<PlusIcon className="size-10" />
						<span className="text-sm font-medium">Create a new workspace</span>
					</Button>
				</div>
			</div>
		</section>
	)
}
