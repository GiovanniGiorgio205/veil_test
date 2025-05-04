'use client'

import { useAuth } from '@/auth'
import { MainHeader } from '@/components/main-header'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function Home() {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<>
			<MainHeader />
			<div className="flex flex-col items-center justify-center min-h-screen py-2 -mt-20">
				<h1 className="text-5xl font-bold mb-4">Welcome to VEIL</h1>
				<p className="text-xl mb-8">
					This is new auth PAAS, that using for all that you need.
				</p>
				<Button
					className={cn('font-bold py-2 px-4')}
					variant={user ? 'outline' : 'default'}
					onClick={() => {
						if (user) {
							router.push('/workspaces')
						} else {
							router.push('/login')
						}
					}}
				>
					{user ? 'Go to workspaces' : 'Get Started'}
				</Button>
			</div>
		</>
	)
}
