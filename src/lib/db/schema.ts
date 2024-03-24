import {
  pgTable,
  serial,
  varchar,
  bigint,
  timestamp,
  text,
  integer,
  index,
  AnyPgColumn,
} from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";

// init nanoid
const nanoid = customAlphabet(nolookalikes, 12);

// START CURATION MIGRATION
export const curations = pgTable(
  "curations",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    txHash: varchar("tx_hash").unique().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    blockNumber: integer("block_number").unique(),
    toAddress: varchar("to_address", { length: 42 }),
    amount: bigint("amount", { mode: "bigint" }),
    tokenAddress: varchar("token_address", { length: 42 }),
    uri: varchar("uri", { length: 256 }),
    text: text("text"),
    commentCount: integer("comments_count").notNull().default(0),
  },
  (t) => {
    return {
      blockNumberIndex: index("block_number_index").on(t.blockNumber),
      createdAtIndex: index('create_at_index').on(t.createdAt),
      txHashIndex: index("tx_hash_index").on(t.txHash),
      amountIndex: index('amount_index').on(t.amount),
      commentCountIndex: index('comment_count_index').on(t.commentCount)
    };
  }
);

export type CurationSchema = typeof curations.$inferSelect;
export const genCurationId = () => `curation_${nanoid(12)}`;
// END CURATION MIGRATION

// START DUMP
export const dump = pgTable("dump", {
  id: serial("id").primaryKey().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  eventDump: text("event_dump"),
});
// END DUMP

// START USER MIGRATION
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    // clerkUserId: varchar("clerk_user_id", { length: 256 }).notNull().unique(),
    web3Address: varchar("web3_address", { length: 42 }),
    karma: integer("karma").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    usernameIndex: index("web3_address_index").on(t.web3Address),
  })
);

export const genUserId = () => `user_${nanoid(12)}`;
export type UserSchema = typeof users.$inferSelect;
// END USER MIGRATION

// START COMMENTS MIGRATION
export const comments = pgTable(
  "comments",
  {
    id: varchar("id", { length: 256 }).primaryKey().notNull(),
    curationId: varchar("curation_id", { length: 256 })
      .notNull()
      .references(() => curations.id),
    parentId: varchar("parent_id", { length: 256 }).references(
      (): AnyPgColumn => comments.id
    ),
    username: varchar("username", { length: 256 }),
    comment: text("comment").notNull(),
    author: varchar("author", { length: 256 }).references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    created_at_index: index("c_created_at_idx").on(t.createdAt),
    curation_id_index: index("c_curation_id_idx").on(t.curationId),
    author_index: index("c_author_idx").on(t.author),
  })
);

export const genCommentId = () => `comment_${nanoid(12)}`;
export type CommentSchema = typeof comments.$inferSelect;
// END COMMENTS SECTION
