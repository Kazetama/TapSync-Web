import fs from "fs";

export function makeController(name) {
    const content = `
export default class ${name} {
  index(req, res) {}
  store(req, res) {}
  show(req, res) {}
  update(req, res) {}
  destroy(req, res) {}
}
`;

    fs.writeFileSync(
        `app/controllers/${name}.js`,
        content
    );

    console.log(`Controller ${name} created`);
}
