export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown'

export interface HealthCheckResult {
	status: HealthStatus
	name: string
	type: string
	responseTime: string
	timestamp: string
	details?: Record<string, any>
	error?: string
}

export interface HealthCheckOptions {
	timeout?: number
	forceRefresh?: boolean
}

export interface HealthCheck {
	name: string
	type: string
	check: (options?: HealthCheckOptions) => Promise<HealthCheckResult>
	defaultPollingInterval?: number
}

export type SystemHealthStatus = {
	status: HealthStatus
	checks: HealthCheckResult[]
	timestamp: string
}
