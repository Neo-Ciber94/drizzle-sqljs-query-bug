import { loadDatabase } from "./lib/db";
import { posts } from "./lib/schema";

async function main() {
  const { db } = await loadDatabase("./data/sqlite.db");

  const queryResult = await db.query.posts.findMany({
    with: {
      comments: true,
    },
  });

  console.log({ queryResult });
}

main().catch(console.error);
