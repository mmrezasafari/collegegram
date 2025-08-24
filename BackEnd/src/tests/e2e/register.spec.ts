import request from "supertest"
import { AppDataSource } from "../../data-source"
import { makeApp } from "../../api";
import { Express } from "express";

describe("User", () => {

  let app: Express;

  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("Register", () => {
    it("Should failed because username is wrong", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "dal",
          password: "Pswd@@123",
          email: "test@gmail.com"
        }).expect(400);
    })

    it("Should failed because password is wrong", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "daleya",
          password: "Pswd@",
          email: "test@gmail.com"
        }).expect(400);
    })

    it("Should failed because email is wrong", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "daleya",
          password: "Pswd@@123",
          email: "tesgmaom"
        }).expect(400);
    })

    it("Success", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "daleya",
          password: "Pssg@2gyl",
          email: "testg@email.com"
        }).expect(200);
    })

    it("Should failed because email is already exist", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "zahra",
          password: "Pswd@@123",
          email: "test@gmail.com"
        }).expect(409);
    })

    it("Should failed because username is already exist", async () => {
      await request(app)
        .post("/register")
        .send({
          username: "daleya",
          password: "Pswd@@123",
          email: "test@gmail.com"
        }).expect(409);
    });
  });
});