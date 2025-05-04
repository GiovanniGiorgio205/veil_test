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
import { Checkbox } from '@/components/ui/checkbox'
import { ApplicationsWorkspace } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Check, ChevronRight, Pen, PlusIcon, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function WorkspacePage({
	params,
}: {
	params: Promise<{ tenant: string }>
}) {
	const { isLoading } = useAuth()
	const { tenant } = use(params)
	const [workspace, setWorkspace] = useState<ApplicationsWorkspace>()
	const [isEditing, setEditMode] = useState<boolean>(false)
	const router = useRouter()

	useEffect(() => {
		const getWorkspace = async () => {
			const response = await fetch(`/api/workspaces/${tenant}`)

			const workspace_data = await response.json()
			setWorkspace(workspace_data.workspace)
		}

		getWorkspace()
	}, [])

	return (
		<section className="w-full flex justify-center py-8">
			{isLoading ? (
				<div>
					<RefreshCw className="animate-spin" />
				</div>
			) : (
				<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
					<div className="container grid grid-cols-[1fr_auto] grid-rows-2 h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
						<h1 className="text-3xl font-bold col-start-1 row-start-1">
							{workspace?.name}
						</h1>
						<p className="text-sm text-muted-foreground row-start-2 col-start-1 col-end-2">
							{workspace?.tenant}
						</p>
						<Button
							variant={isEditing ? 'default' : 'outline'}
							className="row-span-2 col-start-2 my-auto"
							onClick={() => {
								setEditMode(!isEditing)
							}}
						>
							{isEditing ? <Check /> : <Pen />}
						</Button>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
						{workspace?.Applications.map((app) => (
							<Card
								key={app.ID}
								className={cn(
									'transition-all duration-100',
									isEditing ? 'border-accent' : 'border'
								)}
							>
								<CardHeader>
									<CardTitle className="flex flex-row items-stretch gap-2">
										<p className="flex-1">{app.ApplicationName}</p>
										{isEditing ? (
											<Checkbox className="size-4" onClick={() => {}} />
										) : (
											<></>
										)}
									</CardTitle>
									<CardDescription>{app.ApplicationTenant}</CardDescription>
									<CardContent className="px-0 h-[60px]"></CardContent>
									<CardFooter className="px-0">
										<Button
											className="w-full"
											variant={'outline'}
											onClick={() =>
												router.push(`/${workspace.tenant}/${app.ID}`)
											}
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
							className="flex flex-col gap-2 h-[170px] rounded-2xl"
							onClick={() => {
								router.push(`/${tenant}/create`)
							}}
						>
							<PlusIcon className="size-10" />
							<span className="text-sm font-medium">
								Create a new application
							</span>
						</Button>
					</div>
				</div>
			)}
		</section>
	)
}
