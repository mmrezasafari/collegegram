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
      const id = user.body.data.id;
      await request(app).get(`/users/${id}`)
        .expect(401)
    }),
      it("should get user by id", async () => {
        const id = user.body.data.id;
        await request(app)
          .get(`/users/${id}`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(200)
      }),
      it("should fail because id is not valid", async () => {
        const id = "22";
        await request(app).get(`/users/${id}`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(400)
      }),
      it("should fail because user is not found", async () => {
        const id = "8a679df5-607f-4b88-ab12-975275eedace";
        await request(app).get(`/users/${id}`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(404)
      })
  })
})