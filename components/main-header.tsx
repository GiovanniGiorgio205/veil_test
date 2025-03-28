import { AuthButton } from './auth-btn'
import { ThemeToggle } from './theme-toggle'

export function MainHeader() {
	return (
		<header className="bg-background sticky top-0 z-40 w-full border-b flex justify-center">
			<div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
				<div className="flex gap-6 md:gap-10"></div>
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
