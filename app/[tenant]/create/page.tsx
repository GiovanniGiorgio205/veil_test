'use client'

import { CreateApplicationForm } from '@/components/forms/create-application'
import { SiteConfig } from '@/lib/site-config'
import { GalleryVerticalEnd } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { use } from 'react'

export default function CreateApplicationPage({
	params,
}: {
	params: Promise<{ tenant: string }>
}) {
	const { tenant } = use(params)

	return (
		<div className="grid lg:grid-cols-[2fr_1fr] flex-1">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link href="/" className="flex items-center gap-2 font-medium">
						<div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-5" />
						</div>
						{SiteConfig.title}
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-lg">
						<CreateApplicationForm ws_id={tenant} />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<Image
					src="/tumblr_bbf85018172a79562ce9990ab84a17a0_3ff527d5_2048.jpg"
					alt="Image"
					width={1000}
					height={1000}
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale-25"
				/>
			</div>
		</div>
	)
}
