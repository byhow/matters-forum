import {
  pgTable,
  serial,
  varchar,
  bigint,
  timestamp,
} from "drizzle-orm/pg-core";

export const curations = pgTable("curations", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  toAddress: varchar("to_address", { length: 42 }),
  amount: bigint("amount", { mode: "bigint" }),
  tokenAddress: varchar("phone", { length: 42 }),
  uri: varchar("uri", { length: 256 }),
});
