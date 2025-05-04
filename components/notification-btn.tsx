'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useNotifications } from '@/hooks/use-notifications'
import { Inbox, Settings, ShredderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import NotificationSettings from './notfication-settings'
import { NotificationCard } from './notification-card'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog'

export function NotificationButton() {
	const { notifications, clearNotifications, markAllAsRead } =
		useNotifications()
	const [open, setOpen] = useState(false)

	const unreadCount = notifications.filter(
		(notification) => !notification.read
	).length

	// Mark all as read when popover is opened
	useEffect(() => {
		if (open) {
			markAllAsRead()
		}
	}, [open, markAllAsRead])

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button variant="outline" size="icon" className="relative">
					<Inbox className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
							{unreadCount > 9 ? '9+' : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-96 p-0" align="end">
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="font-medium w-full">Notifications</h3>
					<Button
						variant="ghost"
						size="icon"
						onClick={clearNotifications}
						disabled={notifications.length === 0}
					>
						<ShredderIcon />
					</Button>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="ghost" size="icon">
								<Settings />
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Notification Settings</DialogTitle>
								<DialogDescription>
									Make changes to your notification settings here. Click save
									when editing is done.
								</DialogDescription>
							</DialogHeader>
							<NotificationSettings />
						</DialogContent>
					</Dialog>
				</div>
				{notifications.length === 0 ? (
					<div className="p-4 text-center text-muted-foreground">
						No notifications
					</div>
				) : (
					<ScrollArea className="h-[300px]">
						<div className="flex flex-col gap-1 p-1">
							{notifications.map((notification) => (
								<NotificationCard
									key={notification.id}
									notification={notification}
								/>
							))}
						</div>
					</ScrollArea>
				)}
			</PopoverContent>
		</Popover>
	)
}
