import DotenvFlow from "dotenv-flow";
DotenvFlow.config()
import { DataSource } from "typeorm";
import { UserEntity } from "./modules/user/user.entity";
import { SessionEntity } from "./modules/auth/session.entity";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  dropSchema: process.env.NODE_ENV === 'test',
  entities: [UserEntity, SessionEntity],
  subscribers: [],
  migrations: [],
})