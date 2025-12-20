import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { getDB } from "../database/connection.js";
import { Schema } from "./schema.js";

export async function runMigrations() {
    const db = await getDB(true);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS kaze_migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

    const [rows] = await db.execute("SELECT name FROM kaze_migrations");
    const executed = rows.map(r => r.name);

    const migrationsDir = path.resolve("database/migrations");
    const files = fs.readdirSync(migrationsDir);

    for (const file of files) {
        if (executed.includes(file)) continue;

        const filePath = path.join(migrationsDir, file);
        const fileUrl = pathToFileURL(filePath).href;

        const migration = await import(fileUrl);

        const schema = new Schema();
        await migration.default.up(schema);

        for (const sql of schema.queries) {
            await db.execute(sql);
        }

        await db.execute(
            "INSERT INTO kaze_migrations (name) VALUES (?)",
            [file]
        );

        console.log(`Migrated: ${file}`);
    }
}
