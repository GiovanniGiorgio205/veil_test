'use client'

import { useRouter } from 'next/navigation'
import { AuthButton } from './auth-btn'
import { ThemeToggle } from './theme-toggle'
import { Button } from './ui/button'

export function MainHeader() {
	const router = useRouter()

	return (
		<header className="bg-background/25 backdrop-blur-sm sticky top-0 z-40 w-full border-b flex justify-center">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex gap-6 md:gap-10">
					<Button
						className="p-0"
						variant={'link'}
						onClick={() => {
							router.push('/')
						}}
					>
						<h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
							VEIL
						</h1>
					</Button>
				</div>
				<div className="flex flex-1 items-center justify-end space-x-4">
					<nav className="flex items-center space-x-1">
						<AuthButton />
						<ThemeToggle />
					</nav>
				</div>
			</div>
		</header>
	)
}
