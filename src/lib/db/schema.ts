import {
  pgTable,
  serial,
  varchar,
  bigint,
  timestamp,
  text,
  integer,
  index
} from "drizzle-orm/pg-core";

export const curations = pgTable("curations", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  blockNumber: integer('block_number'),
  toAddress: varchar("to_address", { length: 42 }),
  amount: bigint("amount", { mode: "bigint" }),
  tokenAddress: varchar("token_address", { length: 42 }),
  uri: varchar("uri", { length: 256 }),
}, (t) => {
  return {
    blockNumberIndex: index('block_number_index').on(t.blockNumber),
    toAddressIndex: index('to_address_index').on(t.toAddress)
  }
});

export const dump = pgTable("dump", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eventDump: text("event_dump"),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 256 }).primaryKey().notNull(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  email: varchar("email", { length: 256 }),
  karma: integer("karma").notNull().default(0),
  password: varchar("password", { length: 256 }).notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
},
  (t) => ({
    username_idx: index("username_idx").on(t.username),
  })
);