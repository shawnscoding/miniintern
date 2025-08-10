import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: parseInt(process.env.DB_PORT || ""),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, "..", "models", "*.{ts,js}")],
  synchronize: false,
  // logging: ["query", "error"],
});
