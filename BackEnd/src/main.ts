import { makeApp } from "./api";
import { AppDataSource } from "./data-source";
import DotenvFlow from "dotenv-flow";
DotenvFlow.config()

AppDataSource.initialize().then((dataSource) => {
  const app = makeApp(dataSource);
  app.listen(3000, () => console.log(`Listening on Port 3000`))
})