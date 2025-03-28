import { initializeHealthChecks } from "./health"

// Initialize server-side services
export function initializeServer() {
  // Initialize health checks
  initializeHealthChecks()

  // You can add more server initialization here
  // For example, connecting to message queues, initializing caches, etc.
}

