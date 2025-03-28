import type {
	HealthCheck,
	HealthCheckResult,
	HealthStatus,
	SystemHealthStatus,
} from './types'

class HealthService {
	private checks: Map<string, HealthCheck> = new Map()
	private cache: Map<string, { result: HealthCheckResult; timestamp: number }> =
		new Map()
	private cacheTimeout = 5000 // 5 seconds cache

	registerCheck(check: HealthCheck): void {
		this.checks.set(check.name, check)
	}

	unregisterCheck(name: string): void {
		this.checks.delete(name)
		this.cache.delete(name)
	}

	getCheck(name: string): HealthCheck | undefined {
		return this.checks.get(name)
	}

	getAllChecks(): HealthCheck[] {
		return Array.from(this.checks.values())
	}

	async runCheck(
		name: string,
		options?: {
			timeout?: number
			forceRefresh?: boolean
		}
	): Promise<HealthCheckResult> {
		const check = this.checks.get(name)
		if (!check) {
			throw new Error(`Health check "${name}" not found`)
		}

		// Check cache first if not forcing refresh
		if (!options?.forceRefresh) {
			const cached = this.cache.get(name)
			const now = Date.now()

			if (cached && now - cached.timestamp < this.cacheTimeout) {
				return cached.result
			}
		}

		const startTime = Date.now()

		try {
			// Add timeout if specified
			if (options?.timeout) {
				const result = await Promise.race([
					check.check(options),
					new Promise<HealthCheckResult>((_, reject) =>
						setTimeout(
							() => reject(new Error('Health check timed out')),
							options.timeout
						)
					),
				])

				// Cache the result
				this.cache.set(name, { result, timestamp: Date.now() })

				return result
			}

			const result = await check.check(options)

			// Cache the result
			this.cache.set(name, { result, timestamp: Date.now() })

			return result
		} catch (error) {
			const endTime = Date.now()
			const responseTime = endTime - startTime

			const result = {
				status: 'unhealthy',
				name: check.name,
				type: check.type,
				error: error instanceof Error ? error.message : 'Unknown error',
				responseTime: `${responseTime}ms`,
				timestamp: new Date().toISOString(),
			}

			// Cache the error result too
			this.cache.set(name, { result, timestamp: Date.now() })

			return result
		}
	}

	async runAllChecks(options?: {
		timeout?: number
		forceRefresh?: boolean
	}): Promise<SystemHealthStatus> {
		const checks = this.getAllChecks()
		const results = await Promise.all(
			checks.map((check) => this.runCheck(check.name, options))
		)

		// Determine overall system status
		let overallStatus: HealthStatus = 'healthy'

		if (results.some((r) => r.status === 'unhealthy')) {
			overallStatus = 'unhealthy'
		} else if (results.some((r) => r.status === 'degraded')) {
			overallStatus = 'degraded'
		} else if (results.some((r) => r.status === 'unknown')) {
			overallStatus = 'degraded'
		}

		return {
			status: overallStatus,
			checks: results,
			timestamp: new Date().toISOString(),
		}
	}
}

// Singleton instance
export const healthService = new HealthService()
