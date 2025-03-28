import { createApiHealthCheck } from './checks/api-check'
import { databaseHealthCheck } from './checks/database-check'
import { healthService } from './health-service'
import type { SystemHealthStatus } from './types'

// Initialize with default health checks
export function initializeHealthChecks() {
	// Register database health check
	healthService.registerCheck(databaseHealthCheck)

	// Register external API health checks if configured
	// Example: checking if a critical third-party API is available
	if (process.env.EXTERNAL_API_URL) {
		healthService.registerCheck(
			createApiHealthCheck('external-api', process.env.EXTERNAL_API_URL)
		)
	}

	// You can add more health checks here as needed
}

// Helper function to run all health checks
export async function checkSystemHealth(
	forceRefresh = false
): Promise<SystemHealthStatus> {
	return healthService.runAllChecks({
		timeout: 5000,
		forceRefresh,
	})
}

// Export the health service for direct access
export * from './types'
export { healthService }
