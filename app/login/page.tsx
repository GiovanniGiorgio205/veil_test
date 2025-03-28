'use client'

import { GalleryVerticalEnd } from 'lucide-react'

import { useAuth } from '@/auth'
import { LoginForm } from '@/components/login-form'
import { SiteConfig } from '@/lib/site-config'
import Image from 'next/image'
import Link from 'next/link'

export default function LoginPage() {
	const { login } = useAuth()

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
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
					<div className="w-full max-w-xs">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<Image
					src="/628c49a36cc22a51359b4a67e6ed1126.jpg"
					alt="Image"
					width={1000}
					height={1000}
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale-75"
				/>
			</div>
		</div>
	)
}
