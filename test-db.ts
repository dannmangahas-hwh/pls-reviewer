import { getTotalQuestionCount, getQuestionsBySubject, getTopicQuestionCounts } from "./apps/web/lib/queries/questions";
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env.local manually for this standalone script
dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

async function run() {
  try {
    console.log("Testing connection to MongoDB Atlas...");
    const totalCount = await getTotalQuestionCount();
    console.log(`✅ SUCCESS! Total questions in DB: ${totalCount}`);
    
    console.log("\nTesting topic aggregation for Civil Law...");
    const counts = await getTopicQuestionCounts("civil-law");
    console.log(`✅ SUCCESS! Found ${counts.length} topics in Civil Law.`);
    console.log("Top 3 Topics by Question Count:");
    console.log(counts.slice(0, 3));

    process.exit(0);
  } catch (error) {
    console.error("❌ FAILED:", error);
    process.exit(1);
  }
}

run();
