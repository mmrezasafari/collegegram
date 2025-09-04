import request from "supertest";
import { Express } from "express";
import { makeApp } from "../../api";
import { AppDataSource } from "../../data-source";

describe("user", () => {
  let app: Express;
  let user: request.Response;
  let accessToken: string;
  let refreshToken: string;
  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);
    user = await request(app)
      .post("/register")
      .send({
        username: "daleya2",
        password: "Pswd@@123",
        email: "test2@gmail.com"
      })
    const loginRes = await request(app)
      .post("/login")
      .send({
        usernameOrEmail: user.body.data.username,
        password: "Pswd@@123"
      })
    accessToken = loginRes.header["set-cookie"][0].split("=")[1];
    refreshToken = loginRes.header["set-cookie"][0].split("=")[1];
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("get user", () => {
    it("should fail because user is not authorized", async () => {
      const username = user.body.data.username;
      await request(app).get(`/users/${username}`)
        .expect(401)
    }),
      it("should get user by username", async () => {
        const username = user.body.data.username;
        await request(app)
          .get(`/users/${username}`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(200)
      }),
      it("should fail because user is not found", async () => {
        const username = "mobina";
        await request(app).get(`/users/${username}`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(404)
      })
  })
})