import type { HealthCheck, HealthCheckResult } from '../types'

export function createApiHealthCheck(
	name: string,
	url: string,
	options?: {
		method?: string
		headers?: Record<string, string>
		expectedStatus?: number
		timeout?: number
		pollingInterval?: number
	}
): HealthCheck {
	return {
		name,
		type: 'api',
		defaultPollingInterval: options?.pollingInterval || 60000,

		async check(): Promise<HealthCheckResult> {
			const startTime = Date.now()

			try {
				const controller = new AbortController()
				const timeoutId = options?.timeout
					? setTimeout(() => controller.abort(), options.timeout)
					: null

				const response = await fetch(url, {
					method: options?.method || 'GET',
					headers: options?.headers,
					signal: options?.timeout ? controller.signal : undefined,
					cache: 'no-store',
				})

				if (timeoutId) clearTimeout(timeoutId)

				const endTime = Date.now()
				const responseTime = endTime - startTime

				const expectedStatus = options?.expectedStatus || 200
				const isHealthy = response.status === expectedStatus

				return {
					status: isHealthy ? 'healthy' : 'unhealthy',
					name: this.name,
					type: this.type,
					responseTime: `${responseTime}ms`,
					timestamp: new Date().toISOString(),
					details: {
						url,
						statusCode: response.status,
						expectedStatus,
					},
					error: isHealthy
						? undefined
						: `Expected status ${expectedStatus}, got ${response.status}`,
				}
			} catch (error) {
				const endTime = Date.now()
				const responseTime = endTime - startTime

				return {
					status: 'unhealthy',
					name: this.name,
					type: this.type,
					error: error instanceof Error ? error.message : 'Unknown API error',
					responseTime: `${responseTime}ms`,
					timestamp: new Date().toISOString(),
					details: {
						url,
					},
				}
			}
		},
	}
}
