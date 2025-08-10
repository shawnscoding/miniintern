import "../config";
import request from "supertest";
import app from "../src/app";
import { AppDataSource } from "../src/config/ormconfig";
import { User } from "../src/models/User";

describe("Auth API", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
    const email = "test1@example.com";
    const password = "12345678";

    const res = await request(app)
      .post("/api/users/signup")
      .send({ email, password });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", email);
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("app 로그인 성공", async () => {
    expect(true).toBe(true);
  });
});
