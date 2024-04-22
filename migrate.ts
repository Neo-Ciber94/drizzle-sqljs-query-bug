import { loadDatabase } from "./src/lib/db";
import { migrate } from "drizzle-orm/sql-js/migrator";

async function run() {
  const { db } = await loadDatabase("./data/sqlite.db");

  migrate(db, { migrationsFolder: "./drizzle" });
}

run().catch(console.error);
