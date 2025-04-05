import { createApiHealthCheck } from './checks/api-check'
import { databaseHealthCheck } from './checks/database-check'
import { healthService } from './health-service'
import type { SystemHealthStatus } from './types'

// Initialize with default health checks
export function initializeHealthChecks() {
	// Only initialize once
	if (healthService.isInitialized()) {
		console.log('Health checks already initialized, skipping')
		return
	}

	console.log('Initializing health checks...')

	// Register database health check
	healthService.registerCheck(databaseHealthCheck)

	// Register external API health check if configured
	if (process.env.EXTERNAL_API_URL) {
		healthService.registerCheck(
			createApiHealthCheck('external-api', process.env.EXTERNAL_API_URL)
		)
	}

	// Mark as initialized
	healthService.setInitialized(true)

	console.log('Health checks initialized with:', [
		...healthService.getAllChecks().map((c) => c.name),
	])
}

// Helper function to run all health checks
export async function checkSystemHealth(
	forceRefresh = false
): Promise<SystemHealthStatus> {
	// Ensure health checks are initialized
	if (!healthService.isInitialized()) {
		console.log('Health checks not initialized, initializing now...')
		initializeHealthChecks()
	}

	return healthService.runAllChecks({
		timeout: 5000,
		forceRefresh,
	})
}

// Export the health service for direct access
export * from './types'
export { healthService }
