'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HealthStatus, SystemHealthStatus } from '@/lib/health'
import { cn } from '@/lib/utils'
import {
	AlertCircle,
	CheckCircle,
	Database,
	Loader2,
	RefreshCw,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export type IndicatorPosition =
	| 'bottom-right'
	| 'bottom-left'
	| 'top-right'
	| 'top-left'

const positionClasses = {
	'bottom-right': 'bottom-4 right-4 items-end',
	'bottom-left': 'bottom-4 left-4 items-start',
	'top-right': 'top-4 right-4 items-end',
	'top-left': 'top-4 left-4 items-start',
}

export function HealthIndicator({
	pollingInterval = 30000,
	position = 'bottom-right',
}: {
	pollingInterval?: number
	position?: IndicatorPosition
}) {
	const [health, setHealth] = useState<SystemHealthStatus | null>(null)
	const [loading, setLoading] = useState(true)
	const [expanded, setExpanded] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const checkHealth = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const res = await fetch('/api/health', {
				cache: 'no-store',
				headers: { 'x-force-refresh': 'true' },
			})

			if (!res.ok) {
				throw new Error(`Health check failed with status: ${res.status}`)
			}

			const data = await res.json()
			console.log('Health check response:', data)

			// Validate the response format
			if (!data || typeof data !== 'object') {
				throw new Error('Invalid health check response format')
			}

			// Ensure it has the required fields
			if (!data.status || !Array.isArray(data.checks)) {
				console.warn('Health check response missing required fields:', data)
				setHealth({
					status: data.status || 'unknown',
					checks: Array.isArray(data.checks) ? data.checks : [],
					timestamp: data.timestamp || new Date().toISOString(),
				})
			} else {
				setHealth(data)
			}
		} catch (error) {
			console.error('Health check error:', error)
			setError(error instanceof Error ? error.message : 'Unknown error')

			setHealth({
				status: 'unhealthy',
				checks: [],
				timestamp: new Date().toISOString(),
			})
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		checkHealth()
		const interval = setInterval(checkHealth, pollingInterval)
		return () => clearInterval(interval)
	}, [checkHealth, pollingInterval])

	// Find database check
	const dbCheck = health?.checks?.find((check) => check.type === 'database')

	// Get status badge variant
	const getStatusVariant = (
		status: HealthStatus
	): 'default' | 'destructive' | 'outline' | 'secondary' => {
		switch (status) {
			case 'healthy':
				return 'default'
			case 'degraded':
				return 'secondary'
			case 'unhealthy':
				return 'destructive'
			default:
				return 'outline'
		}
	}

	// Get button color based on status
	const getButtonColor = () => {
		if (loading) return ''

		const status = dbCheck?.status || health?.status || 'unknown'

		switch (status) {
			case 'healthy':
				return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
			case 'degraded':
				return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
			case 'unhealthy':
			case 'unknown':
			default:
				return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
		}
	}

	return (
		<div
			className={cn(
				'fixed z-50 flex flex-col gap-2',
				positionClasses[position]
			)}
		>
			{expanded && (
				<Card className="w-80 shadow-lg animate-in slide-in-from-bottom-5">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center w-full">
							<CardTitle className="text-base">System Health</CardTitle>
							<div className="flex items-center gap-1">
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={checkHealth}
									disabled={loading}
								>
									<RefreshCw
										className={cn('h-3.5 w-3.5', loading && 'animate-spin')}
									/>
									<span className="sr-only">Refresh</span>
								</Button>
								<Button
									variant="ghost"
									size="icon"
									className="h-7 w-7"
									onClick={() => setExpanded(false)}
								>
									<span className="sr-only">Close</span>×
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-3 max-h-80 overflow-y-auto pb-4">
						{error && (
							<div className="text-red-500 text-sm border border-red-200 rounded p-2 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
								Error fetching health status: {error}
							</div>
						)}

						{health?.checks && health.checks.length > 0 ? (
							health.checks.map((check) => (
								<div
									key={check.name}
									className="border-t pt-2 first:border-t-0 first:pt-0"
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											{check.status === 'healthy' ? (
												<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
											) : (
												<AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
											)}
											<span className="font-medium capitalize">
												{check.name}
											</span>
										</div>
										<Badge
											variant={getStatusVariant(check.status)}
											className="capitalize"
										>
											{check.status}
										</Badge>
									</div>

									<div className="text-xs text-muted-foreground mt-1">
										<div>Response time: {check.responseTime}</div>
										{check.details &&
											Object.entries(check.details).map(([key, value]) => (
												<div key={key}>
													<span className="capitalize">{key}:</span>{' '}
													{String(value)}
												</div>
											))}
										{check.error && (
											<div className="text-red-500 mt-1" title={check.error}>
												Error: {check.error}
											</div>
										)}
									</div>
								</div>
							))
						) : (
							<div className="text-center py-2 text-muted-foreground">
								No health checks available
							</div>
						)}

						<div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
							Updated:{' '}
							{health
								? new Date(health.timestamp).toLocaleTimeString()
								: 'Never'}
						</div>
					</CardContent>
				</Card>
			)}

			<Button
				variant="outline"
				size="sm"
				onClick={() => setExpanded(!expanded)}
				className={cn('shadow-md rounded-md', getButtonColor())}
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin mr-2" />
				) : (
					<Database className="h-4 w-4 mr-2" />
				)}
				<span className="text-xs">
					{loading
						? 'Checking...'
						: dbCheck?.status === 'healthy'
						? 'DB Connected'
						: dbCheck?.status === 'degraded'
						? 'DB Degraded'
						: 'DB Error'}
				</span>
			</Button>
		</div>
	)
}
