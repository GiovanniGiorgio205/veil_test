'use client'

import { useAuth } from '@/auth'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

export function AuthButton() {
	const { user } = useAuth()
	const router = useRouter()

	return (
		<Button
			variant={user ? 'outline' : 'default'}
			onClick={() => {
				if (user) {
					router.push('/workspaces')
				} else {
					router.push('/login')
				}
			}}
		>
			{user ? `Go to ${user.displayName}'s workspaces` : 'Login'}
		</Button>
	)
}
