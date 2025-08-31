import request from "supertest";
import { AppDataSource } from "../../data-source";
import { makeApp } from "../../api";
import { Express } from "express";

describe("User", () => {
  let app: Express;
  let userId: string;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const dataSource = await AppDataSource.initialize();
    app = makeApp(dataSource);

    const user = await request(app)
      .post("/register")
      .send({
        username: "mobina",
        password: "Pssg@2gyl",
        email: "mobina@email.com",
      })
      .expect(200);

    const user1 = await request(app)
      .post("/register")
      .send({
        username: "mona12",
        password: "Pon@32r2454",
        email: "mona@email.com",
      })
      .expect(200);
    const loginRes = await request(app)
      .post("/login")
      .send({
        usernameOrEmail: user.body.data.username,
        password: "Pssg@2gyl",
      })
    accessToken = loginRes.header["set-cookie"][0].split("=")[1];
    refreshToken = loginRes.header["set-cookie"][0].split("=")[1];
    userId = user.body.data.id;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("Update", () => {
    it("Success", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          lastName: "mobina",
          firstName: "kheiri",
          email: "mobina.kheiri@gmail.com",
          bio: "Art lover, finding beauty in art gallery",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(200);
    });
    // it("Should fail because user is not authorized", async () => {
    //   await request(app)
    //     .patch(`/me`)
    //     .send({
    //       lastName: "mobinaaa",
    //     })
    //     .expect(401);
    // });

    it("should fail because id is not valid", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          bio: "gol tar az gol",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(400);
    });

    it("should fail because password is weak", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          firstName: "mobina",
          password: "Pswd@",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(400);
    });

    it("should fail because email is wrong", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          lastName: "kheiri",
          email: "tesgmaom",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(400);
    });

    it("should fail because user is not found", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          firstName: "mobina",
          lastName: "kheiri",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(404);
    });

    it("should fail because email already exists", async () => {
      await request(app)
        .patch(`/me`)
        .send({
          email: "mona@email.com",
        })
        .set("Cookie", [`accessToken=${accessToken}`, `refreshToken=${refreshToken}`])
        .expect(409);
    });
  });
});
