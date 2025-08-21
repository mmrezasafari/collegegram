import request from "supertest";
import { Express } from "express";
import { makeApp } from "../../api";
import { AppDataSource } from "../../data-source";

describe("user", () => {
  let app: Express;

  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("get user", () => {
    it("should get user by id", async () => {
      const user = await request(app)
        .post("/register")
        .send({
          username: "daleya2",
          password: "Pswd@@123",
          email: "test2@gmail.com"
        }).expect(200);
      const id = user.body.data.id;
      await request(app).get(`/users/${id}`).expect(200)
    }),
      it("should failed because id is not valid", async () => {
        const id = "22";
        await request(app).get(`/users/${id}`).expect(400)
      }),
      it("should failed because user is not found", async () => {
        const id = "8a679df5-607f-4b88-ab12-975275eedace";
        await request(app).get(`/users/${id}`).expect(404)
      })
  })
})