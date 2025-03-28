'use client'

import { HealthToggle } from '@/components/health-toggle'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { HealthStatus, SystemHealthStatus } from '@/lib/health'
import { AlertCircle, BookOpen, CheckCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
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

	// Helper function to get status badge variant
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

	// Find database check
	const dbCheck = health?.checks.find((check) => check.type === 'database')

	return (
		<section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
			<div className="flex max-w-[980px] flex-col items-start gap-2">
				<div className="p-8 max-w-6xl mx-auto">
					<div className="flex justify-between items-center mb-8">
						<h1 className="text-3xl font-bold">System Health Dashboard</h1>
						<div className="flex items-center gap-2">
							{health && (
								<Badge
									variant={getStatusVariant(health.status)}
									className="capitalize mr-2"
								>
									{health.status}
								</Badge>
							)}
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
							<Button variant="ghost" size="sm" asChild>
								<Link href="/health/guide">
									<BookOpen className="h-4 w-4 mr-2" />
									Guide
								</Link>
							</Button>
						</div>
					</div>

					{/* Database Connection Status */}
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Database Connection</h2>
						{loading && !dbCheck ? (
							<Card>
								<CardHeader>
									<Skeleton className="h-6 w-32" />
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-3/4" />
									</div>
								</CardContent>
							</Card>
						) : dbCheck ? (
							<Card>
								<CardHeader className="pb-2">
									<div className="flex justify-between items-center">
										<CardTitle>{dbCheck.name}</CardTitle>
										<Badge
											variant={getStatusVariant(dbCheck.status)}
											className="capitalize"
										>
											{dbCheck.status}
										</Badge>
									</div>
									<CardDescription>
										Response time: {dbCheck.responseTime}
									</CardDescription>
								</CardHeader>
								<CardContent className="pb-2">
									<div className="grid gap-3 md:grid-cols-2">
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Last Checked:
												</span>
												<span>
													{new Date(dbCheck.timestamp).toLocaleTimeString()}
												</span>
											</div>
											{dbCheck.details &&
												Object.entries(dbCheck.details).map(([key, value]) => (
													<div key={key} className="flex justify-between">
														<span className="text-muted-foreground capitalize">
															{key}:
														</span>
														<span
															className="truncate max-w-[200px]"
															title={String(value)}
														>
															{String(value)}
														</span>
													</div>
												))}
										</div>

										<div>
											{dbCheck.error ? (
												<Alert variant="destructive">
													<AlertCircle className="h-4 w-4" />
													<AlertTitle>Connection Error</AlertTitle>
													<AlertDescription className="text-xs break-words">
														{dbCheck.error}
													</AlertDescription>
												</Alert>
											) : (
												<Alert className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300">
													<CheckCircle className="h-4 w-4" />
													<AlertTitle>Connection Established</AlertTitle>
													<AlertDescription className="text-xs">
														The database connection is working properly.
													</AlertDescription>
												</Alert>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardHeader>
									<CardTitle>No Database Check Available</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground">
										No database health check has been registered. Please check
										your configuration.
									</p>
								</CardContent>
							</Card>
						)}
					</div>

					{/* Other Health Checks */}
					{health && health.checks.length > 1 && (
						<div className="mb-8">
							<h2 className="text-xl font-semibold mb-4">Other Services</h2>
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{health.checks
									.filter((check) => check.type !== 'database')
									.map((check) => (
										<Card key={check.name}>
											<CardHeader className="pb-2">
												<div className="flex justify-between items-center">
													<CardTitle className="text-base capitalize">
														{check.name}
													</CardTitle>
													<Badge
														variant={getStatusVariant(check.status)}
														className="capitalize"
													>
														{check.status}
													</Badge>
												</div>
												<CardDescription>
													<span className="capitalize">{check.type}</span>
												</CardDescription>
											</CardHeader>
											<CardContent className="space-y-2 text-sm pb-2">
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Response Time:
													</span>
													<span>{check.responseTime}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Last Checked:
													</span>
													<span>
														{new Date(check.timestamp).toLocaleTimeString()}
													</span>
												</div>
											</CardContent>
											{check.error && (
												<CardFooter className="pt-0">
													<Alert variant="destructive" className="w-full">
														<AlertCircle className="h-4 w-4" />
														<AlertTitle>Error</AlertTitle>
														<AlertDescription className="text-xs break-words">
															{check.error}
														</AlertDescription>
													</Alert>
												</CardFooter>
											)}
										</Card>
									))}
							</div>
						</div>
					)}

					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-4">Settings</h2>
						<HealthToggle />
					</div>

					<div className="text-xs text-muted-foreground">
						Last updated:{' '}
						{health ? new Date(health.timestamp).toLocaleString() : '-'}
					</div>
				</div>
			</div>
		</section>
	)
}
