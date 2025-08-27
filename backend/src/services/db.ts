import mysql from "mysql2/promise";

if (
  !process.env.MYSQL_DB_NAME ||
  !process.env.MYSQL_HOSTNAME ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_PORT ||
  !process.env.MYSQL_USERNAME
) {
  throw new Error("Missing MySQL environment variables");
}

const db = mysql.createPool({
  connectionLimit: 10,
  database: process.env.MYSQL_DB_NAME,
  host: process.env.MYSQL_HOSTNAME,
  password: process.env.MYSQL_PASSWORD,
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  queueLimit: 0,
  user: process.env.MYSQL_USERNAME,
  waitForConnections: true,
});

export const checkConnection = async (): Promise<void> => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database");
    connection.release();
  } catch (error) {
    console.error("Could not connect to database:", error);
    throw error;
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
