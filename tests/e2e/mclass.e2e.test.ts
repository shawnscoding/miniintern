import "../../config";
import request from "supertest";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/ormconfig";
import { TestUtils } from "../helpers/test-utils";
import { MClass } from "../../src/models/MClass";

describe("Start mclass.e2e test", () => {
  let adminToken: string;
  let createdId: number;

  beforeAll(async () => {
    await AppDataSource.initialize();

    const login = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@example.com", password: "password_1" });
    adminToken = login.body.token;

    await AppDataSource.manager.delete(MClass, {
      mclassCode: "TE-03-001",
    });
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("관리자만 클래스 생성 가능", async () => {
    const res = await request(app)
      .post("/api/mclasses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        mclassCode: "TE-03-001",
        title: "테스트 클래스",
        description: "테스트 설명",
        maxApplicants: 100,
        startAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    createdId = res.body.id;
  });

  it("클래스 목록 조회", async () => {
    const res = await request(app).get("/api/mclasses");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("클래스 상세 조회", async () => {
    const res = await request(app)
      .get(`/api/mclasses/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdId);
    expect(res.body).toHaveProperty("title");
    expect(typeof res.body.title).toBe("string");
    expect(typeof res.body.description).toBe("string");
    expect(typeof res.body.maxParticipants).toBe("number");
    expect(typeof res.body.appliedParticipants).toBe("number");
    expect(typeof res.body.hostId).toBe("number");

    TestUtils.validateDate(res.body.startAt);
    TestUtils.validateDate(res.body.endAt);
    TestUtils.validateDate(res.body.createdAt);
  });

  it("관리자만 클래스 삭제 가능", async () => {
    const res = await request(app)
      .delete(`/api/mclasses/${createdId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
  });
});
