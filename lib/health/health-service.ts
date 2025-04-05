import type {
	HealthCheck,
	HealthCheckOptions,
	HealthCheckResult,
	HealthStatus,
	SystemHealthStatus,
} from './types'

// Use a global variable to track initialization state
let isInitialized = false

class HealthService {
	private checks: Map<string, HealthCheck> = new Map()
	private cache: Map<string, { result: HealthCheckResult; timestamp: number }> =
		new Map()
	private cacheTimeout = 5000 // 5 seconds cache

	registerCheck(check: HealthCheck): void {
		console.log(`Registering health check: ${check.name} (${check.type})`)
		this.checks.set(check.name, check)
		// Log the current checks after registration
		console.log(`Current health checks: ${[...this.checks.keys()].join(', ')}`)
	}

	unregisterCheck(name: string): void {
		console.log(`Unregistering health check: ${name}`)
		this.checks.delete(name)
		this.cache.delete(name)
	}

	getCheck(name: string): HealthCheck | undefined {
		return this.checks.get(name)
	}

	getAllChecks(): HealthCheck[] {
		const checks = Array.from(this.checks.values())
		console.log(
			`Getting all health checks: ${checks.map((c) => c.name).join(', ')}`
		)
		return checks
	}

	isInitialized(): boolean {
		return isInitialized
	}

	setInitialized(value: boolean): void {
		isInitialized = value
	}

	async runCheck(
		name: string,
		options?: HealthCheckOptions
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

		try {
			// Add timeout if specified
			let result: HealthCheckResult

			if (options?.timeout) {
				result = await Promise.race([
					check.check(options),
					new Promise<HealthCheckResult>((_, reject) =>
						setTimeout(
							() => reject(new Error('Health check timed out')),
							options.timeout
						)
					),
				])
			} else {
				result = await check.check(options)
			}

			// Ensure the result has all required fields
			const validatedResult: HealthCheckResult = {
				status: result.status || 'unknown',
				name: result.name || check.name,
				type: result.type || check.type,
				responseTime: result.responseTime || '0ms',
				timestamp: result.timestamp || new Date().toISOString(),
				details: result.details || {},
				error: result.error,
			}

			// Cache the result
			this.cache.set(name, { result: validatedResult, timestamp: Date.now() })

			return validatedResult
		} catch (error) {
			const errorResult: HealthCheckResult = {
				status: 'unhealthy',
				name: check.name,
				type: check.type,
				error: error instanceof Error ? error.message : 'Unknown error',
				responseTime: '0ms',
				timestamp: new Date().toISOString(),
			}

			// Cache the error result too
			this.cache.set(name, { result: errorResult, timestamp: Date.now() })

			return errorResult
		}
	}

	async runAllChecks(
		options?: HealthCheckOptions
	): Promise<SystemHealthStatus> {
		const checks = this.getAllChecks()

		// If no checks are registered, return a default status
		if (checks.length === 0) {
			console.warn('No health checks registered when running all checks')
			return {
				status: 'unknown',
				checks: [],
				timestamp: new Date().toISOString(),
			}
		}

		const results = await Promise.all(
			checks.map((check) =>
				this.runCheck(check.name, options).catch((error) => ({
					status: 'unhealthy' as const,
					name: check.name,
					type: check.type,
					error: error instanceof Error ? error.message : 'Unknown error',
					responseTime: '0ms',
					timestamp: new Date().toISOString(),
				}))
			)
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
