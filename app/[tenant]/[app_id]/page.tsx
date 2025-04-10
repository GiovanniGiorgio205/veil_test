'use client'

import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UserApplications } from '@/lib/types'
import { Check, Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function ApplicationPage({
	params,
}: {
	params: Promise<{ tenant: string; app_id: string }>
}) {
	const { tenant, app_id } = use(params)
	const [application, setApplication] = useState<UserApplications>()
	const [isEditing, setEditMode] = useState<boolean>(false)
	const router = useRouter()

	useEffect(() => {
		const getApplication = async () => {
			const response = await fetch(`/api/applications/${app_id}`)

			const application_data = await response.json()
			setApplication(application_data.application)
		}

		getApplication()
	}, [])

	return (
		<section className="w-full flex justify-center py-8">
			<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
				<div className="container grid grid-cols-[1fr_auto] grid-rows-2 h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
					<h1 className="text-3xl font-bold col-start-1 row-start-1">
						{application?.ApplicationName}
					</h1>
					{/* <p className="text-sm text-muted-foreground row-start-2 col-start-1 col-end-2">
						{application?.API_Token}
					</p> */}
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
				<Tabs defaultValue="dashboard" className="w-[400px]">
					<TabsList>
						<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
						<TabsTrigger value="settings">Settings</TabsTrigger>
					</TabsList>
					<TabsContent value="dashboard">
						Make changes to your account here.
					</TabsContent>
					<TabsContent value="settings">Change your password here.</TabsContent>
				</Tabs>
			</div>
		</section>
	)
}
