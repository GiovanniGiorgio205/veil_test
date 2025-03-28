'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
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

	const checkHealth = useCallback(async () => {
		setLoading(true)
		try {
			const res = await fetch('/api/health', {
				cache: 'no-store',
				headers: { 'x-force-refresh': 'true' },
			})
			const data = await res.json()
			setHealth(data)
		} catch (error) {
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
	const dbCheck = health?.checks.find((check) => check.type === 'database')
	const isTop = position.startsWith('top')

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

	return (
		<div
			className={cn(
				'fixed z-50 flex flex-col gap-2',
				positionClasses[position]
			)}
		>
			{expanded && health && (
				<Card className="w-80 shadow-lg animate-in slide-in-from-bottom-5">
					<CardHeader className="pb-2">
						<div className="flex justify-between items-center w-full">
							<CardTitle className="text-base">Database Status</CardTitle>
							<div className="flex items-center gap-1">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7"
												onClick={checkHealth}
												disabled={loading}
											>
												<RefreshCw
													className={cn(
														'h-3.5 w-3.5',
														loading && 'animate-spin'
													)}
												/>
												<span className="sr-only">Refresh</span>
											</Button>
										</TooltipTrigger>
										<TooltipContent>Refresh health status</TooltipContent>
									</Tooltip>
								</TooltipProvider>
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
						{dbCheck ? (
							<div className="border-t pt-2 first:border-t-0 first:pt-0">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										{dbCheck.status === 'healthy' ? (
											<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
										) : (
											<AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
										)}
										<span className="font-medium">Database</span>
									</div>
									<Badge
										variant={getStatusVariant(dbCheck.status)}
										className="capitalize"
									>
										{dbCheck.status}
									</Badge>
								</div>

								<div className="text-xs text-muted-foreground mt-1">
									<div>Response time: {dbCheck.responseTime}</div>
									{dbCheck.details &&
										Object.entries(dbCheck.details).map(([key, value]) => (
											<div key={key}>
												<span className="capitalize">{key}:</span>{' '}
												{String(value)}
											</div>
										))}
									{dbCheck.error && (
										<div className="text-red-500 mt-1" title={dbCheck.error}>
											Error: {dbCheck.error}
										</div>
									)}
								</div>
							</div>
						) : (
							<div className="text-center py-2 text-muted-foreground">
								No database health check available
							</div>
						)}

						{health.checks.filter((check) => check.type !== 'database').length >
							0 && (
							<div className="border-t pt-2 mt-2">
								<h5 className="font-medium mb-2">Other Services</h5>
								{health.checks
									.filter((check) => check.type !== 'database')
									.map((check) => (
										<div key={check.name} className="mb-2 last:mb-0">
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

											{check.error && (
												<div
													className="text-xs text-red-500 ml-6 mt-1 truncate"
													title={check.error}
												>
													{check.error}
												</div>
											)}
										</div>
									))}
							</div>
						)}

						<div className="text-xs text-muted-foreground mt-3 pt-2 border-t">
							Updated: {new Date(health.timestamp).toLocaleTimeString()}
						</div>
					</CardContent>
				</Card>
			)}

			<Button
				variant="outline"
				size="sm"
				onClick={() => setExpanded(!expanded)}
				className={cn(
					'shadow-md rounded-full',
					dbCheck?.status === 'healthy'
						? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
						: dbCheck?.status === 'degraded'
						? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
						: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
				)}
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin mr-2" />
				) : (
					<Database className="h-4 w-4 mr-2" />
				)}
				<span className="text-xs">
					{loading
						? 'Checking DB...'
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
