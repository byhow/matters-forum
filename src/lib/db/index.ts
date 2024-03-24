import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL not found");
}

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client);

export * from './schema'