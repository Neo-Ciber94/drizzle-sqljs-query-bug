import { loadDatabase } from "./lib/db";
import { comments, posts } from "./lib/schema";

async function seedDatabase() {
  console.log("⌛ Seeding database...");
  const { db, save } = await loadDatabase("./data/sqlite.db");

  await db.insert(posts).values([
    {
      id: 1,
      title: "Post 1",
      content: "This is the first post",
    },
    {
      id: 2,
      title: "Post 2",
      content: "This is our second post",
    },
  ]);

  await db.insert(comments).values([
    {
      postId: 1,
      content: "Comment for the first post",
    },
    {
      postId: 1,
      content: "Other comment for the first post",
    },
    {
      postId: 1,
      content: "Yes, one comment more for the first post",
    },
    {
      postId: 2,
      content: "This is for the second post",
    },
  ]);

  await save();
  console.log("✅ Done!");
}

seedDatabase().catch(console.error);
