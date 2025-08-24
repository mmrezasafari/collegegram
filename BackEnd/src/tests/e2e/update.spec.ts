import request from "supertest";
import { AppDataSource } from "../../data-source";
import { makeApp } from "../../api";
import { Express } from "express";

describe("User", () => {
  let app: Express;
  let userId: string;

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
        username: "mona",
        password: "Pon@32r",
        email: "mona@email.com",
      })
      .expect(200);

    userId = user.body.data.id;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  describe("Update", () => {
    it("Success", async () => {
      await request(app)
        .patch(`/users/${userId}`)
        .send({
          lastName: "mobina",
          firstName: "kheiri",
          email: "mobina.kheiri@gmail.com",
          bio: "Art lover, finding beauty in art gallery",
        })
        .expect(200);
    });

    it("should fail because id is not valid", async () => {
      const id = "22";
      await request(app)
        .patch(`/users/${id}`)
        .send({
          bio: "gol tar az gol",
        })
        .expect(400);
    });

    it("should fail because password is weak", async () => {
      await request(app)
        .patch(`/users/${userId}`)
        .send({
          firstName: "mobina",
          password: "Pswd@",
        })
        .expect(400);
    });

    it("should fail because email is wrong", async () => {
      await request(app)
        .patch(`/users/${userId}`)
        .send({
          lastName: "kheiri",
          email: "tesgmaom",
        })
        .expect(400);
    });

    it("should fail because user is not found", async () => {
      const id = "8a679df5-607f-4b88-ab12-975275eedace";
      await request(app)
        .patch(`/users/${id}`)
        .send({
          firstName: "mobina",
          lastName: "kheiri",
        })
        .expect(404);
    });

    it("should fail because email already exists", async () => {
      await request(app)
        .patch(`/users/${userId}`)
        .send({
          email: "mona@email.com",
        })
        .expect(409);
    });
  });
});
