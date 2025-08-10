import "../../config";
import request from "supertest";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/ormconfig";
import { User } from "../../src/models/User";

describe("Start user.e2e test", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  const email = "user201@example.com";
  const password = "password_201";
  let userToken: string;

  it("회원가입 성공", async () => {
    await AppDataSource.manager.delete(User, { email });

    const res = await request(app)
      .post("/api/users/signup")
      .send({ email, password });
    expect(res.status).toBe(201);
  });

  it("로그인 성공", async () => {
    await AppDataSource.manager.delete(User, { email });

    await request(app).post("/api/users/signup").send({ email, password });
    const res = await request(app)
      .post("/api/users/login")
      .send({ email, password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
    userToken = res.body.token;
  });

  it("내 신청 내역 조회", async () => {
    const res = await request(app)
      .get("/api/users/applications")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty("id");
      expect(res.body[0]).toHaveProperty("userId");
      expect(res.body[0]).toHaveProperty("mclassId");
      expect(res.body[0]).toHaveProperty("createdAt");
      expect(res.body[0]).toHaveProperty("title");
      expect(res.body[0]).toHaveProperty("hostId");
    }
  });
});
