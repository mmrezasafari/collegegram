import DotenvFlow from "dotenv-flow";
DotenvFlow.config()
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === 'test',
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [__dirname + "/modules/**/**/*.entity.{ts,js}"],
  subscribers: [],
  migrations: [__dirname + "/migrations/**/*.{ts,js}"],
})