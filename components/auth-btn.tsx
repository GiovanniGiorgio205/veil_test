'use client'

import { useAuth } from '@/auth'
import { LayoutDashboard, LogOutIcon, UserPen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

export function AuthButton() {
	const { user, logout } = useAuth()
	const router = useRouter()

	if (user)
		return (
			<Popover>
				<Tooltip delayDuration={100}>
					<TooltipTrigger asChild>
						<PopoverTrigger asChild>
							<Button variant={'outline'}>
								<div className="flex gap-2 items-center">
									<Avatar className="size-6">
										<AvatarImage src={user.image} />
										<AvatarFallback>
											{user.displayName?.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<p>{user.displayName}</p>
								</div>
							</Button>
						</PopoverTrigger>
					</TooltipTrigger>
					<TooltipContent>
						<p>Your profile</p>
					</TooltipContent>
				</Tooltip>
				<PopoverContent
					className="flex gap-1 flex-col"
					side={'bottom'}
					align={'end'}
				>
					<div className="flex flex-col py-2 gap-2">
						<div className="flex gap-2 items-stretch flex-1 flex-col">
							<Avatar className=" size-full ">
								<AvatarImage src={user.image} />
								<AvatarFallback>{user.displayName?.slice(0, 2)}</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p className="text-2xl font-bold text-ellipsis text-nowrap break-words hyphens-auto text-start mx-4">
									{user.displayName}
								</p>
							</div>
						</div>
						<Badge className="w-full" variant={'secondary'}>
							{user.type}
						</Badge>
					</div>
					<Button
						onClick={() => {
							router.push('/workspaces')
						}}
						variant={'ghost'}
					>
						<LayoutDashboard />
						<p className="w-full text-start">Workspaces</p>
					</Button>
					<Button
						onClick={() => {
							router.push('/settings')
						}}
						variant={'ghost'}
						disabled
					>
						<UserPen />
						<p className="w-full text-start">Profile Settings</p>
					</Button>
					<Button
						onClick={() => {
							logout()
						}}
						variant={'ghost'}
						className="text-red-500"
					>
						<LogOutIcon />
						<p className="w-full text-start">Sign Out</p>
					</Button>
				</PopoverContent>
			</Popover>
		)

	return (
		<Button
			variant={'default'}
			onClick={() => {
				router.push('/login')
			}}
		>
			{'Login'}
		</Button>
	)
}
