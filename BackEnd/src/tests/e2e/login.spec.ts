import request from "supertest"
import { AppDataSource } from "../../data-source";
import { makeApp } from "../../api";
import { Express } from "express";

describe("User", () => {
  let app: Express;
  let user: request.Response;

  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);
    user = await request(app)
      .post("/register")
      .send({
        username: "daleya3",
        password: "Pswd@@123",
        email: "test3@gmail.com"
      })
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("Login", () => {
    it("should failed because username is wrong", async () => {
      await request(app)
        .post("/login")
        .send({
          usernameOrEmail: "dalya",
          password: "Pswd@@123"
        }).expect(400);
    });

    it("should failed because email is wrong", async () => {
      await request(app)
        .post("/login")
        .send({
          usernameOrEmail: "dalyadfdfokpdk",
          password: "Pswd@@123"
        }).expect(400);
    });

    it("should failed because password is wrong", async () => {
      await request(app)
        .post("/login")
        .send({
          usernameOrEmail: "daleya3",
          password: "Pswd@@1"
        }).expect(400);
    });

    it("Success", async () => {
      await request(app)
        .post("/login")
        .send({
          usernameOrEmail: "daleya3",
          password: "Pswd@@123"
        }).expect(200);
    });
  });
});