import { prisma } from '@/lib/prisma'
import type { HealthCheck, HealthCheckResult } from '../types'

export const databaseHealthCheck: HealthCheck = {
	name: 'Supabase DB',
	type: 'database',
	defaultPollingInterval: 30000,

	async check(): Promise<HealthCheckResult> {
		const startTime = Date.now()

		try {
			// Execute a simple query to check connection
			await prisma.$queryRaw`SELECT 1`

			const endTime = Date.now()
			const responseTime = endTime - startTime

			return {
				status: 'healthy',
				name: this.name,
				type: this.type,
				responseTime: `${responseTime}ms`,
				timestamp: new Date().toISOString(),
				details: {
					provider: 'Prisma',
				},
			}
		} catch (error) {
			const endTime = Date.now()
			const responseTime = endTime - startTime

			console.error('Database health check failed:', error)

			return {
				status: 'unhealthy',
				name: this.name,
				type: this.type,
				error:
					error instanceof Error ? error.message : 'Unknown database error',
				responseTime: `${responseTime}ms`,
				timestamp: new Date().toISOString(),
				details: {
					provider: 'Prisma',
				},
			}
		}
	},
}
