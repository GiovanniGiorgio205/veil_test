'use client'

import { useHealthIndicator } from '@/components/providers/health-indicator-provider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useEffect, useState } from 'react'

export function DbHealthToggle() {
	const { setVisible } = useHealthIndicator()
	const [isEnabled, setIsEnabled] = useState(true)

	useEffect(() => {
		setVisible(isEnabled)
	}, [isEnabled, setVisible])

	return (
		<div className="flex items-center space-x-2">
			<Switch
				id="db-health-indicator"
				checked={isEnabled}
				onCheckedChange={setIsEnabled}
			/>
			<Label htmlFor="db-health-indicator">Show DB health indicator</Label>
		</div>
	)
}
