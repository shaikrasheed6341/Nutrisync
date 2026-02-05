import { db } from "./db/db.js";
import { foods } from "./db/schema.js";
import dummydata from "./index.js";

async function main() {
    try {
        console.log("Seeding started...");

        // Ensure values are numbers where expected, although schema defines them as real/integer they might need casting if provided as strings in dummydata
        // Looking at the dummydata provided in index.ts, they look like numbers.

        await db.insert(foods).values(dummydata).onConflictDoNothing();
        console.log("Seeding completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

main();
