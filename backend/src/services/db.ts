import mysql from "mysql2/promise";

import { MYSQL_DB_NAME, MYSQL_HOSTNAME, MYSQL_PASSWORD, MYSQL_PORT, MYSQL_USERNAME } from "../constants/env.js";

const db = mysql.createPool({
  connectionLimit: 10,
  database: MYSQL_DB_NAME,
  host: MYSQL_HOSTNAME,
  password: MYSQL_PASSWORD,
  port: parseInt(MYSQL_PORT),
  queueLimit: 0,
  user: MYSQL_USERNAME,
  waitForConnections: true,
});

export const checkConnection = async (): Promise<void> => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database");
    connection.release();
  } catch (error) {
    console.error("Could not connect to database:", error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await db.end();
    console.log("Disconnecting from MySQL database");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
};

export default db;
