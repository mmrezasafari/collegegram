import request from "supertest";
import { Express } from "express";
import { makeApp } from "../../api";
import { AppDataSource } from "../../data-source";
import path from "path";


describe("like", () => {
  let app: Express;
  let user: request.Response;
  let accessToken: string;
  let refreshToken: string;
  let post: request.Response;
  
  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);
    user = await request(app)
      .post("/register")
      .send({
        username: "Mobinakh",
        password: "Mobin@23",
        email: "mobina@gmail.com"
      })
    const loginRes = await request(app)
      .post("/login")
      .send({
        usernameOrEmail: user.body.data.username,
        password: "Mobin@23"
      })
    accessToken = loginRes.header["set-cookie"][0].split("=")[1];
    refreshToken = loginRes.header["set-cookie"][0].split("=")[1];

    post = await request(app)
      .post("/profile/posts")
      .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
      .field("caption", "")
      .attach("images", path.join(__dirname, "fixtures/test1.jpg"))
      .attach("images", path.join(__dirname, "fixtures/test2.jpg"));
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("Like Post", () => {
      it("should be success", async () => {
        await request(app).post(`/posts/${post.body.data.id}/like`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(200)
      });
      it("should be failed because post not found", async () => {
        await request(app).post(`/posts/deya/follow`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(404)
      });
      it("should be failed because post is liked", async () => {
        await request(app).post(`/posts/${post.body.data.id}/like`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(400)
      });
      it("should be failed because tokens not found", async () => {
        await request(app).post(`/posts/${post.body.data.id}/like`)
          .expect(401)
      });
    })
    describe("UnLike Post", () => {
      it("should be success", async () => {
        await request(app).delete(`/posts/${post.body.data.id}/unlike`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(200)
      });
      it("should be failed because post not found", async () => {
        await request(app).delete(`/posts/deya/unfollow`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(404)
      });
      it("should be failed because post is unliked", async () => {
        await request(app).delete(`/posts/${post.body.data.id}/unlike`)
          .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
          .expect(400)
      });
      it("should be failed because tokens not found", async () => {
        await request(app).delete(`/posts/${post.body.data.id}/unlike`)
          .expect(401)
      });
    })


})