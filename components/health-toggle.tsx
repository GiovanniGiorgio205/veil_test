'use client'

import type { IndicatorPosition } from '@/components/health-indicator'
import { useHealthIndicator } from '@/components/providers/health-indicator-provider'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export function HealthToggle() {
	const { visible, setVisible, position, setPosition } = useHealthIndicator()

	return (
		<Card>
			<CardContent className="pt-6 space-y-4">
				<div className="flex items-center justify-between">
					<Label htmlFor="health-indicator" className="flex-1">
						Show health status indicator
					</Label>
					<Switch
						id="health-indicator"
						checked={visible}
						onCheckedChange={setVisible}
					/>
				</div>

				{visible && (
					<div className="flex items-center justify-between">
						<Label htmlFor="indicator-position" className="flex-1">
							Indicator position
						</Label>
						<Select
							value={position}
							onValueChange={(value) => setPosition(value as IndicatorPosition)}
						>
							<SelectTrigger id="indicator-position" className="w-[180px]">
								<SelectValue placeholder="Select position" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="bottom-right">Bottom Right</SelectItem>
								<SelectItem value="bottom-left">Bottom Left</SelectItem>
								<SelectItem value="top-right">Top Right</SelectItem>
								<SelectItem value="top-left">Top Left</SelectItem>
							</SelectContent>
						</Select>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
