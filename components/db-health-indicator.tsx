/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

type HealthStatus = {
	status: 'healthy' | 'unhealthy'
	responseTime: string
	timestamp: string
	error?: string
}

export function DbHealthIndicator({
	className,
	pollingInterval = 30000,
	initiallyVisible = true,
}: {
	className?: string
	pollingInterval?: number
	initiallyVisible?: boolean
}) {
	const [health, setHealth] = useState<HealthStatus | null>(null)
	const [loading, setLoading] = useState(true)
	const [visible, setVisible] = useState(initiallyVisible)
	const [expanded, setExpanded] = useState(false)

	useEffect(() => {
		// Function to fetch health status
		const checkHealth = async () => {
			try {
				const res = await fetch('/api/health', { cache: 'no-store' })
				const data = await res.json()
				setHealth(data)
			} catch (error) {
				setHealth({
					status: 'unhealthy',
					responseTime: '0ms',
					timestamp: new Date().toISOString(),
					error: 'Failed to fetch health status',
				})
			} finally {
				setLoading(false)
			}
		}

		// Check immediately on mount
		checkHealth()

		// Set up polling interval
		const interval = setInterval(checkHealth, pollingInterval)

		// Clean up on unmount
		return () => clearInterval(interval)
	}, [pollingInterval])

	if (!visible) return null

	return (
		<div
			className={cn(
				'fixed bottom-4 right-4 z-50 flex flex-col items-end',
				className
			)}
		>
			{expanded && health && (
				<div className="bg-background shadow-lg rounded-lg p-3 mb-2 border w-64 text-sm animate-in slide-in-from-bottom-5">
					<div className="flex justify-between items-center mb-2">
						<h4 className="font-medium">Database Status</h4>
						<button
							onClick={() => setExpanded(false)}
							className="text-muted-foreground hover:text-foreground"
						>
							×
						</button>
					</div>
					<div className="space-y-1 text-xs">
						<p>Status: {health.status}</p>
						<p>Response: {health.responseTime}</p>
						<p
							className="text-muted-foreground truncate"
							title={health.timestamp}
						>
							Updated: {new Date(health.timestamp).toLocaleTimeString()}
						</p>
						{health.error && (
							<p className="text-red-500 truncate" title={health.error}>
								Error: {health.error}
							</p>
						)}
					</div>
				</div>
			)}

			<button
				onClick={() => setExpanded(!expanded)}
				className={cn(
					'flex items-center gap-2 px-3 py-2 rounded-full shadow-md transition-all duration-300',
					loading
						? 'bg-muted'
						: health?.status === 'healthy'
						? 'bg-green-100 dark:bg-green-900'
						: 'bg-red-100 dark:bg-red-900',
					'hover:shadow-lg'
				)}
			>
				{loading ? (
					<Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
				) : health?.status === 'healthy' ? (
					<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
				) : (
					<AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
				)}
				<span className="text-xs font-medium">
					{loading
						? 'Checking...'
						: health?.status === 'healthy'
						? 'DB Connected'
						: 'DB Error'}
				</span>
			</button>
		</div>
	)
}
