import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

// For migrations
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 })
const db = drizzle(migrationClient)

// This will run migrations on the database, creating tables if they don't exist
// and ensuring the database schema is up to date
async function main() {
  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "drizzle" })

  console.log("Migrations complete!")

  process.exit(0)
}

main().catch((err) => {
  console.error("Migration failed!")
  console.error(err)
  process.exit(1)
})
