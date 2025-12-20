import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection = null;

export async function getDB(createIfNotExists = false) {
    if (connection) return connection;

    const baseConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT
    };

    if (createIfNotExists) {
        const temp = await mysql.createConnection(baseConfig);
        await temp.execute(
            `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
        );
        await temp.end();
    }

    connection = await mysql.createConnection({
        ...baseConfig,
        database: process.env.DB_NAME
    });

    return connection;
}
