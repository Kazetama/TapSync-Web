import fs from "fs";
import path from "path";
import { getDB } from "../database/connection.js";
import { runMigrations } from "./runner.js";

export async function migrateFresh(options = {}) {
    const migrationsDir = path.resolve("database/migrations");

    const hasMigrations =
        fs.existsSync(migrationsDir) &&
        fs.readdirSync(migrationsDir).length > 0;

    if (!hasMigrations && !options.force) {
        console.error("No migration files found. Abort migrate:fresh.");
        console.error("Use --force to override.");
        process.exit(1);
    }

    const db = await getDB(true);

    try {
        const [tables] = await db.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);

        if (tables.length > 0) {
            await db.execute("SET FOREIGN_KEY_CHECKS = 0");

            for (const row of tables) {
                const table = Object.values(row)[0];
                if (!table) continue;

                await db.execute(`DROP TABLE IF EXISTS \`${table}\``);
                console.log(`Dropped: ${table}`);
            }

            await db.execute("SET FOREIGN_KEY_CHECKS = 1");
            console.log("Database cleaned.");
        }

        if (hasMigrations) {
            await runMigrations();
        } else {
            console.log("No migrations to run.");
        }
    } catch (err) {
        console.error("Migration failed:", err.message);
        process.exitCode = 1;
    } finally {
        await db.end();
        process.exit();
    }
}
