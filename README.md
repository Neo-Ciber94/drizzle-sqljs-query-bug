# Drizzle SQL.js mapping bug

For this schemas

```ts
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
```

This query

```ts
const queryResult = await db.query.posts.findMany({
  with: {
    comments: true,
  },
});
```

Is resulting on a JSON with the values not mapped to the actual type.

```json
[
  {
    "post_id": 1,
    "title": "Post 1",
    "content": "This is the first post",
    "created_at": "2024-04-22T02:46:59.085Z",
    "comments": "[[1,1,\"Comment for the first post\",\"2024-04-22T02:46:59.094Z\"],[2,1,\"Other comment for the first post\",\"2024-04-22T02:46:59.094Z\"],[3,1,\"Yes, one comment more for the first post\",\"2024-04-22T02:46:59.094Z\"]]"
  },
  {
    "post_id": 2,
    "title": "Post 2",
    "content": "This is our second post",
    "created_at": "2024-04-22T02:46:59.086Z",
    "comments": "[[4,2,\"This is for the second post\",\"2024-04-22T02:46:59.094Z\"]]"
  }
]
```
