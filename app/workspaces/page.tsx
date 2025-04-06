'use client'

import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function WorkspacesPage() {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<section className="w-full flex justify-center py-8">
			<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
				<h1 className="text-3xl font-bold">Workspaces</h1>
				<small className="text-sm font-medium leading-none">
					{user?.Workspaces.length}/10
				</small>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
					{user?.Workspaces.map((workspace) => (
						<Card key={workspace.ID} className="h-150px"></Card>
					))}
					{(user?.Workspaces.length ? user?.Workspaces.length : 0) < 10 ? (
						<Button
							variant={'outline'}
							className="flex flex-col gap-2 h-[150px]"
							onClick={() => {
								router.push('/workspaces/create')
							}}
						>
							<PlusIcon className="size-10" />
							<span className="text-sm font-medium">
								Create a new workspace
							</span>
						</Button>
					) : (
						<></>
					)}
				</div>
			</div>
		</section>
	)
}
