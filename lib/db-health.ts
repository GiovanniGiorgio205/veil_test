import { prisma } from './prisma'

/**
 * Checks the health of the database connection
 * @returns An object containing the status and response time
 */
export async function checkDatabaseHealth() {
	const startTime = Date.now()

	try {
		// Execute a simple query to check connection
		// $queryRaw is used here to perform a basic query that works across different databases
		await prisma.$queryRaw`SELECT 1`

		const endTime = Date.now()
		const responseTime = endTime - startTime

		return {
			status: 'healthy',
			responseTime: `${responseTime}ms`,
			timestamp: new Date().toISOString(),
		}
	} catch (error) {
		const endTime = Date.now()
		const responseTime = endTime - startTime

		return {
			status: 'unhealthy',
			error: error instanceof Error ? error.message : 'Unknown database error',
			responseTime: `${responseTime}ms`,
			timestamp: new Date().toISOString(),
		}
	}
}
