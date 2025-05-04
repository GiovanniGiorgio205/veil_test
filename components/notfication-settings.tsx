'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useNotifications } from '@/hooks/use-notifications'
import { Save, ShredderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function NotificationSettings() {
	const { clearNotifications } = useNotifications()
	const [localStorageSize, setLocalStorageSize] = useState<string>('0 KB')
	const [notificationCount, setNotificationCount] = useState<number>(0)
	const [maxAge, setMaxAge] = useState<number>(7)
	const [autoDeleteEnabled, setAutoDeleteEnabled] = useState<boolean>(false)

	// Load settings from localStorage
	useEffect(() => {
		const savedMaxAge = localStorage.getItem('notification-max-age')
		const savedAutoDelete = localStorage.getItem('notification-auto-delete')

		if (savedMaxAge) setMaxAge(Number.parseInt(savedMaxAge))
		if (savedAutoDelete) setAutoDeleteEnabled(savedAutoDelete === 'true')

		// Calculate localStorage usage
		calculateStorageUsage()

		// Get notification count
		const notifications = JSON.parse(
			localStorage.getItem('notifications-storage') ||
				'{"state":{"notifications":[]}}'
		)
		setNotificationCount(notifications.state.notifications.length)
	}, [])

	// Calculate localStorage usage
	const calculateStorageUsage = () => {
		let total = 0
		for (const key in localStorage) {
			if (localStorage.hasOwnProperty(key)) {
				total += localStorage[key].length * 2 // UTF-16 uses 2 bytes per character
			}
		}

		// Convert to KB
		const kb = Math.round((total / 1024) * 100) / 100
		setLocalStorageSize(`${kb} KB`)
	}

	// Save settings
	const saveSettings = () => {
		localStorage.setItem('notification-max-age', maxAge.toString())
		localStorage.setItem(
			'notification-auto-delete',
			autoDeleteEnabled.toString()
		)

		// If auto-delete is enabled, clean up old notifications
		if (autoDeleteEnabled) {
			cleanupOldNotifications()
		}
	}

	// Clean up old notifications
	const cleanupOldNotifications = () => {
		const storage = JSON.parse(
			localStorage.getItem('notifications-storage') ||
				'{"state":{"notifications":[]}}'
		)
		const maxAgeDate = new Date()
		maxAgeDate.setDate(maxAgeDate.getDate() - maxAge)

		const filteredNotifications = storage.state.notifications.filter(
			(notification: any) => {
				const notificationDate = new Date(notification.createdAt)
				return notificationDate > maxAgeDate
			}
		)

		storage.state.notifications = filteredNotifications
		localStorage.setItem('notifications-storage', JSON.stringify(storage))

		// Update notification count
		setNotificationCount(filteredNotifications.length)

		// Recalculate storage usage
		calculateStorageUsage()
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<h3 className="text-sm font-medium">Storage Information</h3>
					<div className="grid grid-cols-2 gap-2 text-sm">
						<div className="text-muted-foreground">Local Storage Usage:</div>
						<div>{localStorageSize}</div>
						<div className="text-muted-foreground">Saved Notifications:</div>
						<div>{notificationCount}</div>
					</div>
				</div>

				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label htmlFor="auto-delete">Auto Delete Old Notifications</Label>
							<p className="text-sm text-muted-foreground">
								Automatically remove notifications older than the specified days
							</p>
						</div>
						<Switch
							id="auto-delete"
							checked={autoDeleteEnabled}
							onCheckedChange={setAutoDeleteEnabled}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="max-age">Maximum Age (days)</Label>
						<Input
							id="max-age"
							type="number"
							min="1"
							max="365"
							value={maxAge}
							onChange={(e) => setMaxAge(Number.parseInt(e.target.value))}
							disabled={!autoDeleteEnabled}
						/>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between">
				<Button
					variant="outline"
					onClick={clearNotifications}
					className="gap-2"
				>
					<ShredderIcon className="h-4 w-4" />
					Clear All Notifications
				</Button>
				<Button onClick={saveSettings} className="gap-2">
					<Save className="h-4 w-4" />
					Save Settings
				</Button>
			</CardFooter>
		</Card>
	)
}
