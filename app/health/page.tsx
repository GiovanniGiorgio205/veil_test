'use client'

import { HealthToggle } from '@/components/health-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SystemHealthStatus } from '@/lib/health'
import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HealthPage() {
	const [health, setHealth] = useState<SystemHealthStatus | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchHealth = async () => {
		setLoading(true)
		try {
			const res = await fetch('/api/health', {
				cache: 'no-store',
				headers: { 'x-force-refresh': 'true' },
			})
			const data = await res.json()
			setHealth(data)
		} catch (error) {
			console.error('Failed to fetch health status:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchHealth()
	}, [])

	return (
		<div className="p-8 max-w-6xl mx-auto">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Health Settings</h1>
				<Button
					variant="outline"
					size="sm"
					onClick={fetchHealth}
					disabled={loading}
				>
					<RefreshCw
						className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
					/>
					Refresh
				</Button>
			</div>

			<Card className="mb-8">
				<CardHeader>
					<CardTitle>Health Indicator Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<HealthToggle />
				</CardContent>
			</Card>

			<div className="text-xs text-muted-foreground">
				Last updated:{' '}
				{health ? new Date(health.timestamp).toLocaleString() : '-'}
			</div>
		</div>
	)
}
