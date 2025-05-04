'use client'

import { ApplicationNavBar } from '@/components/application-nav'
import { UserApplications } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function ApplicationLayout({
	children,
	params,
}: {
	children: React.ReactNode
	params: Promise<{ tenant: string; app_id: string }>
}) {
	const { tenant, app_id } = use(params)
	const [application, setApplication] = useState<UserApplications>()
	const router = useRouter()

	useEffect(() => {
		const getApplication = async () => {
			console.log(`${app_id} | ${tenant}`)

			const response = await fetch(`/api/applications/${app_id}`)
			const application_data = await response.json()

			console.log(application_data.application)

			setApplication(application_data.application)
		}

		getApplication()
	}, [])

	return (
		<section>
			<ApplicationNavBar app={application} tenant={tenant} /> {children}
		</section>
	)
}
