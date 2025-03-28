'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfoIcon } from 'lucide-react'

export default function HealthCheckGuide() {
	return (
		<div className="p-8 max-w-4xl mx-auto">
			<h1 className="text-3xl font-bold mb-6">Health Check System Guide</h1>

			<Tabs defaultValue="overview" className="mb-8">
				<TabsList className="mb-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="examples">Examples</TabsTrigger>
					<TabsTrigger value="best-practices">Best Practices</TabsTrigger>
					<TabsTrigger value="advanced">Advanced Usage</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mb-4">
							Architecture Overview
						</h2>
						<p>
							The health check system is built around a registry pattern where
							you can register any type of health check. Each health check
							implements a common interface and can be run individually or as
							part of a system-wide health check.
						</p>

						<h3 className="text-xl font-semibold mt-6 mb-3">Key Components</h3>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>HealthService</strong>: Central registry that manages
								all health checks
							</li>
							<li>
								<strong>HealthCheck</strong>: Interface that all health checks
								implement
							</li>
							<li>
								<strong>HealthCheckResult</strong>: Standard format for health
								check results
							</li>
							<li>
								<strong>SystemHealthStatus</strong>: Aggregated health status of
								all checks
							</li>
						</ul>
					</div>

					<Alert>
						<InfoIcon className="h-4 w-4" />
						<AlertTitle>Customizable Indicator</AlertTitle>
						<AlertDescription>
							The health indicator can be positioned in any corner of the
							screen. You can change its position in the Settings section of the
							Health Dashboard.
						</AlertDescription>
					</Alert>
				</TabsContent>

				<TabsContent value="examples" className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Basic Health Check Structure</CardTitle>
							<CardDescription>
								The fundamental structure of a health check
							</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
								{`import { HealthCheck, HealthCheckResult } from '@/lib/health/types'

export const myCustomHealthCheck: HealthCheck = {
  name: 'my-service',
  type: 'custom-type',
  defaultPollingInterval: 60000, // 1 minute
  
  async check(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    
    try {
      // Your health check logic here
      // For example, ping a service, check a connection, etc.
      
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      return {
        status: 'healthy', // or 'degraded', 'unhealthy'
        name: this.name,
        type: this.type,
        responseTime: \`\${responseTime}ms\`,
        timestamp: new Date().toISOString(),
        details: {
          // Optional additional details about the service
          version: '1.0.0',
          region: 'us-east-1'
        }
      }
    } catch (error) {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      return {
        status: 'unhealthy',
        name: this.name,
        type: this.type,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: \`\${responseTime}ms\`,
        timestamp: new Date().toISOString()
      }
    }
  }
}`}
							</pre>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>MongoDB Health Check Example</CardTitle>
							<CardDescription>
								A health check for MongoDB connections
							</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
								{`import { HealthCheck, HealthCheckResult } from '@/lib/health/types'
import { MongoClient } from 'mongodb'

export function createMongoDBHealthCheck(
  uri: string,
  options?: {
    timeout?: number,
    pollingInterval?: number
  }
): HealthCheck {
  return {
    name: 'mongodb',
    type: 'database',
    defaultPollingInterval: options?.pollingInterval || 30000,
    
    async check(): Promise<HealthCheckResult> {
      const startTime = Date.now()
      let client: MongoClient | null = null
      
      try {
        // Connect to MongoDB
        client = new MongoClient(uri)
        await client.connect()
        
        // Run a simple command to verify connection
        await client.db('admin').command({ ping: 1 })
        
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        return {
          status: 'healthy',
          name: this.name,
          type: this.type,
          responseTime: \`\${responseTime}ms\`,
          timestamp: new Date().toISOString(),
          details: {
            provider: 'mongodb',
            host: new URL(uri).hostname
          }
        }
      } catch (error) {
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        return {
          status: 'unhealthy',
          name: this.name,
          type: this.type,
          error: error instanceof Error ? error.message : 'Unknown MongoDB error',
          responseTime: \`\${responseTime}ms\`,
          timestamp: new Date().toISOString(),
          details: {
            provider: 'mongodb',
            host: new URL(uri).hostname
          }
        }
      } finally {
        // Close the connection
        if (client) await client.close()
      }
    }
  }
}`}
							</pre>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>GraphQL API Health Check Example</CardTitle>
							<CardDescription>
								A health check for GraphQL endpoints
							</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
								{`import { HealthCheck, HealthCheckResult } from '@/lib/health/types'

export function createGraphQLHealthCheck(
  endpoint: string,
  options?: {
    headers?: Record<string, string>,
    timeout?: number,
    pollingInterval?: number
  }
): HealthCheck {
  return {
    name: 'graphql-api',
    type: 'api',
    defaultPollingInterval: options?.pollingInterval || 60000,
    
    async check(): Promise<HealthCheckResult> {
      const startTime = Date.now()
      
      try {
        // Simple introspection query to check if GraphQL endpoint is responsive
        const query = \`{
          __schema {
            queryType {
              name
            }
          }
        }\`
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers
          },
          body: JSON.stringify({ query }),
          cache: 'no-store'
        })
        
        const data = await response.json()
        
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        const isHealthy = response.ok && !data.errors
        
        return {
          status: isHealthy ? 'healthy' : 'unhealthy',
          name: this.name,
          type: this.type,
          responseTime: \`\${responseTime}ms\`,
          timestamp: new Date().toISOString(),
          details: {
            endpoint,
            statusCode: response.status
          },
          error: isHealthy ? undefined : 
            data.errors ? JSON.stringify(data.errors) : \`HTTP \${response.status}\`
        }
      } catch (error) {
        const endTime = Date.now()
        const responseTime = endTime - startTime
        
        return {
          status: 'unhealthy',
          name: this.name,
          type: this.type,
          error: error instanceof Error ? error.message : 'Unknown GraphQL error',
          responseTime: \`\${responseTime}ms\`,
          timestamp: new Date().toISOString(),
          details: {
            endpoint
          }
        }
      }
    }
  }
}`}
							</pre>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="best-practices" className="space-y-4">
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mb-4">Best Practices</h2>

						<div className="space-y-4">
							<div>
								<h3 className="text-lg font-semibold">
									1. Keep Health Checks Lightweight
								</h3>
								<p>
									Health checks should be quick and non-intrusive. Avoid complex
									queries or operations that could impact the performance of
									your application.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">2. Handle Timeouts</h3>
								<p>
									Always implement timeouts to prevent health checks from
									hanging indefinitely. The health check system provides
									built-in timeout support.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									3. Provide Meaningful Error Messages
								</h3>
								<p>
									When a health check fails, include detailed error information
									to help diagnose the issue.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									4. Use Appropriate Polling Intervals
								</h3>
								<p>
									Set appropriate polling intervals based on the criticality of
									the service. Critical services might need more frequent checks
									than non-critical ones.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									5. Consider Resource Usage
								</h3>
								<p>
									Be mindful of the resources consumed by health checks,
									especially for external services that might have rate limits
									or usage-based billing.
								</p>
							</div>
						</div>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Registering Health Checks</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
								{`// lib/health/index.ts
import { healthService } from './health-service'
import { databaseHealthCheck } from './checks/database-check'
import { createMongoDBHealthCheck } from './checks/mongodb-check'
import { createGraphQLHealthCheck } from './checks/graphql-check'

export function initializeHealthChecks() {
  // Register database health check
  healthService.registerCheck(databaseHealthCheck)
  
  // Register MongoDB health check if configured
  if (process.env.MONGODB_URI) {
    healthService.registerCheck(
      createMongoDBHealthCheck(process.env.MONGODB_URI)
    )
  }
  
  // Register GraphQL API health check if configured
  if (process.env.GRAPHQL_ENDPOINT) {
    healthService.registerCheck(
      createGraphQLHealthCheck(
        process.env.GRAPHQL_ENDPOINT,
        {
          headers: {
            Authorization: \`Bearer \${process.env.GRAPHQL_API_KEY || ''}\`
          }
        }
      )
    )
  }
}`}
							</pre>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="advanced" className="space-y-6">
					<div className="prose prose-sm dark:prose-invert max-w-none">
						<h2 className="text-2xl font-semibold mb-4">Advanced Usage</h2>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-semibold">Programmatic Access</h3>
								<p className="mb-2">
									You can access health status programmatically in your
									application:
								</p>
								<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
									{`import { healthService } from '@/lib/health'

// Check a specific service
const dbStatus = await healthService.runCheck('database')

// Check all services
const systemHealth = await healthService.runAllChecks()

// Use health status in your application logic
if (dbStatus.status === 'healthy') {
  // Proceed with database operations
} else {
  // Show error or fallback to alternative
}`}
								</pre>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									Custom Health Check UI
								</h3>
								<p>
									You can create custom UI components to display health status
									in different parts of your application. The health indicator
									component can be customized or extended to suit your needs.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									Integration with Monitoring Systems
								</h3>
								<p>
									The health check API endpoint can be integrated with external
									monitoring systems like Datadog, New Relic, or Prometheus to
									provide alerts and historical data.
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold">
									Customizing Indicator Position
								</h3>
								<p>
									The health indicator position can be customized
									programmatically:
								</p>
								<pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
									{`import { useHealthIndicator } from '@/components/providers/health-indicator-provider'

function MyComponent() {
  const { setPosition } = useHealthIndicator()
  
  // Change position programmatically
  const moveToTopRight = () => {
    setPosition('top-right')
  }
  
  return (
    <button onClick={moveToTopRight}>
      Move to Top Right
    </button>
  )
}`}
								</pre>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
