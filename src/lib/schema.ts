import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import * as columns from "./columns";
import { relations } from "drizzle-orm";

export const posts = sqliteTable("post", {
  id: integer("post_id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: columns
    .date("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const comments = sqliteTable("comment", {
  id: integer("comment_id").primaryKey(),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id),
  content: text("content").notNull(),
  createdAt: columns
    .date("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const postRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
}));

export const commentRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));
