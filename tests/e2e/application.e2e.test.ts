import "../../config";
import request from "supertest";
import app from "../../src/app";
import { AppDataSource } from "../../src/config/ormconfig";
import { Application } from "../../src/models/Application";
import { MClass } from "../../src/models/MClass";

describe("application.e2e test 시작", () => {
  const mclassCode = "TE-02-01";
  let userToken: string;
  let classId: number = 1;

  beforeAll(async () => {
    await AppDataSource.initialize();
    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: "user1@example.com", password: "password_1" });
    userToken = loginRes.body.token;
    const userId = loginRes.body.userId;

    const mclass = await AppDataSource.manager.findOneBy(MClass, {
      mclassCode,
    });
    if (!mclass) throw Error("mclass not found, check the test data setup");

    await AppDataSource.manager.delete(Application, {
      userId,
      mclassId: mclass.id,
    });

    await AppDataSource.manager.update(MClass, mclass.id, {
      appliedParticipants: () => `appliedParticipants - 1`,
    });
    classId = mclass.id;
  });
  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("신청 성공 여부 확인", async () => {
    const res = await request(app)
      .post(`/api/mclasses/${classId}/apply`)
      .set("Authorization", `Bearer ${userToken}`);
    await request(app)
      .post(`/api/mclasses/${classId}/apply`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("ok", true);
  });
});
