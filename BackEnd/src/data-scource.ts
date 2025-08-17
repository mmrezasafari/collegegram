import "reflect-metadata"
import { DataSource } from "typeorm"
import { UserEntity } from "./modules/user/entity/user.entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Roza1381",
    database: "rahnemagram",
    synchronize: true,
    logging: false,
    entities: [UserEntity],
    migrations: [],
    subscribers: [],
})
