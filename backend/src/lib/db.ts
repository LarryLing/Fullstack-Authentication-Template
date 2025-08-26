import mysql from "mysql2/promise";

const db = mysql.createPool({
  connectionLimit: 10,
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOSTNAME,
  password: process.env.RDS_PASSWORD,
  port: parseInt(process.env.RDS_PORT || "3306"),
  queueLimit: 0,
  user: process.env.RDS_USERNAME,
  waitForConnections: true,
});

export const checkConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log("Connected to MySQL database");
    connection.release();
  } catch (error) {
    console.error("Could not connect to database:", error);
    throw error;
  }
};

export const disconnectFromDatabase = async () => {
  try {
    await db.end();
    console.log("Disconnecting from MySQL database");
  } catch (error) {
    console.error("Error disconnecting from database:", error);
    throw error;
  }
};

export default db;
