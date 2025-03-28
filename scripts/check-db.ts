#!/usr/bin/env node
import { checkDatabaseHealth } from "../lib/db-health"

/**
 * CLI script to check database health
 * Run with: npx tsx scripts/check-db.ts
 */
async function main() {
  console.log("Checking database connection...")

  const health = await checkDatabaseHealth()

  if (health.status === "healthy") {
    console.log("✅ Database connection is healthy")
    console.log(`Response time: ${health.responseTime}`)
  } else {
    console.error("❌ Database connection failed")
    console.error(`Error: ${health.error}`)
    console.error(`Response time: ${health.responseTime}`)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unexpected error:", error)
    process.exit(1)
  })

