import request from "supertest";
import { Express } from "express";
import { makeApp } from "../../api";
import { AppDataSource } from "../../data-source";

describe("follow", () => {
  let app: Express;
  let user: request.Response;
  let user2: request.Response;
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
    user2 = await request(app)
      .post("/register")
      .send({
        username: "daleya",
        password: "Pswd@@123",
        email: "test@gmail.com"
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
  describe("Follow User", () => {
    it("should be success", async () => {
      await request(app).post(`/users/${user2.body.data.username}/follow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(200)
    });
    it("should be failed because user not fount", async () => {
      await request(app).post(`/users/deya/follow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(404)
    });
    it("should be failed because user is my follower", async () => {
      await request(app).post(`/users/${user2.body.data.username}/follow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(400)
    });
    it("should be failed because tokens not fount", async () => {
      await request(app).post(`/users/${user2.body.data.username}/follow`)
        .expect(401)
    });
  })
  describe("Unfollow User", () => {
    it("should be success", async () => {
      await request(app).delete(`/users/${user2.body.data.username}/unfollow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(200)
    });
    it("should be failed because user not fount", async () => {
      await request(app).delete(`/users/deya/unfollow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(404)
    });
    it("should be failed because user is not my follower", async () => {
      await request(app).delete(`/users/${user2.body.data.username}/unfollow`)
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(400)
    });
    it("should be failed because tokens not fount", async () => {
      await request(app).delete(`/users/${user2.body.data.username}/unfollow`)
        .expect(401)
    });
  })
})
