'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'
import type { Notification } from '@/types/notification'
import { formatDistanceToNow } from 'date-fns'
import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react'

interface NotificationCardProps {
	notification: Notification
}

export function NotificationCard({ notification }: NotificationCardProps) {
	const { title, message, type, createdAt, read, id } = notification
	const { removeNotification } = useNotifications()

	const icons = {
		info: <Info className="h-4 w-4 text-blue-500" />,
		success: <Check className="h-4 w-4 text-green-500" />,
		warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
		error: <AlertCircle className="h-4 w-4 text-red-500" />,
	}

	const icon = icons[type] || icons.info

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation()
		removeNotification(id)
	}

	return (
		<Card
			className={cn(
				'transition-colors hover:bg-muted/50 cursor-pointer relative',
				!read && 'border-l-4 border-l-primary'
			)}
		>
			<CardContent className="p-4 flex gap-3">
				<div className="mt-0.5">{icon}</div>
				<div className="space-y-1 flex-1">
					<p className="text-sm font-medium leading-none">{title}</p>
					<p className="text-sm text-muted-foreground">{message}</p>
					<p className="text-xs text-muted-foreground">
						{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
					</p>
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6 absolute top-2 right-2 opacity-50 hover:opacity-100"
					onClick={handleDelete}
				>
					<X className="h-3 w-3" />
					<span className="sr-only">Delete</span>
				</Button>
			</CardContent>
		</Card>
	)
}
