#!/usr/bin/env node
import { Command } from "commander";
import { makeController } from "../core/cli/makeController.js";
import { makeMigration } from "../core/cli/makeMigration.js";
import { runMigrations } from "../core/migration/runner.js";
import { migrateFresh } from "../core/migration/fresh.js";

const program = new Command();

program
    .command("make:controller <name>")
    .action(makeController);

program
    .command("make:migration <name>")
    .action(makeMigration);

program
    .command("migrate")
    .action(runMigrations);

program
    .command("migrate:fresh")
    .description("Drop all tables and re-run migrations")
    .option("-f, --force", "Force fresh migration even if no migration files exist")
    .action(async (options) => {
        const { migrateFresh } = await import("../core/migration/fresh.js");
        await migrateFresh(options);
    });


program.parse();
