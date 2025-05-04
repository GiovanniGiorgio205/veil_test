'use client'

import { use } from 'react'

export default function SettingsPage({
	params,
}: {
	params: Promise<{ tenant: string; app_id: string }>
}) {
	const { app_id } = use(params)
	return (
		<section className="w-full flex justify-center py-8">
			<div className="container flex flex-col h-16 space-x-4 sm:justify-between sm:space-x-0 gap-2">
				<h1 className="text-3xl font-bold col-start-1 row-start-1">Settings</h1>
			</div>
		</section>
	)
}
