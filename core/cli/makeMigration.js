import fs from "fs";

export function makeMigration(name) {
    const fileName = `${Date.now()}_${name}.js`;

    const content = `
export default {
  up(schema) {
    schema.createTable("users", table => {
      table.id();
      table.string("name");
      table.timestamps();
    });
  },

  down(schema) {
    schema.dropTable("users");
  }
};
`;

    fs.writeFileSync(
        `database/migrations/${fileName}`,
        content
    );

    console.log(`Migration ${fileName} created`);
}
