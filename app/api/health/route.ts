import {
	checkSystemHealth,
	healthService,
	initializeHealthChecks,
} from '@/lib/health'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
	// Ensure health checks are initialized
	if (!healthService.isInitialized()) {
		// console.log(
		// 	'Health checks not initialized in API route, initializing now...'
		// )
		initializeHealthChecks()
	}

	// Check for specific health check in query params
	const url = new URL(request.url)
	const checkName = url.searchParams.get('check')

	// Check if this is a forced refresh
	const forceRefresh = request.headers.get('x-force-refresh') === 'true'

	try {
		if (checkName) {
			// Run specific health check
			const check = healthService.getCheck(checkName)
			if (!check) {
				return NextResponse.json(
					{ error: `Health check "${checkName}" not found` },
					{ status: 404 }
				)
			}

			const result = await healthService.runCheck(checkName, {
				timeout: 5000,
				forceRefresh,
			})
			return NextResponse.json(result)
		} else {
			// Run all health checks
			const health = await checkSystemHealth(forceRefresh)

			// Set appropriate status code based on health check result
			const status =
				health.status === 'healthy'
					? 200
					: health.status === 'degraded'
					? 207
					: 503

			// console.log('Health check result:', {
			// 	status: health.status,
			// 	checksCount: health.checks.length,
			// 	checks: health.checks.map((c) => ({ name: c.name, status: c.status })),
			// })

			return NextResponse.json(health, { status })
		}
	} catch (error) {
		console.error('Health check error:', error)

		return NextResponse.json(
			{
				status: 'unhealthy',
				error: error instanceof Error ? error.message : 'Unknown error',
				timestamp: new Date().toISOString(),
				checks: [],
			},
			{ status: 500 }
		)
	}
}
