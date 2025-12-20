export class Schema {
    constructor() {
        this.queries = [];
    }

    createTable(name, callback) {
        const table = new Table();
        callback(table);

        const sql = `CREATE TABLE ${name} (${table.columns.join(", ")})`;
        this.queries.push(sql);
    }

    dropTable(name) {
        this.queries.push(`DROP TABLE ${name}`);
    }
}

class Table {
    constructor() {
        this.columns = [];
    }

    id() {
        this.columns.push("id INT AUTO_INCREMENT PRIMARY KEY");
    }

    string(name) {
        this.columns.push(`${name} VARCHAR(255)`);
    }

    timestamps() {
        this.columns.push("created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
        this.columns.push("updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
    }
}
