import "../config";
import { AppDataSource } from "../src/config/ormconfig";
import { SetupUtils } from "./test-utils";
import request from "supertest";
import app from "../src/app";

describe("테스트 데이터 세팅", () => {
  beforeAll(async () => {
    await AppDataSource.initialize();
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("대량 테스트 데이터 생성", async () => {
    console.log("🚀 대량 테스트 데이터 생성 시작...");

    try {
      // 200명의 일반 유저 생성
      const userPromises: any[] = [];
      const testUsers = SetupUtils.generateTestUsers(200);
      for (const user of testUsers) {
        userPromises.push(SetupUtils.createUser(user));
      }

      const users = await Promise.all(userPromises);
      expect(users).toHaveLength(200);

      console.log(`✅ ${users.length}명의 유저 생성 완료`);

      const loginRes = await request(app).post("/api/users/login").send({
        email: "user1@example.com",
        password: "password_1",
      });

      // 5개의 클래스 생성
      const mclassPromises: any[] = [];
      const mclassData = SetupUtils.generateTestMClasses(5);

      for (const data of mclassData) {
        mclassPromises.push(SetupUtils.createMClass(data, loginRes.body.token));
      }

      const testMClasses = await Promise.all(mclassPromises);
      console.log(`✅ ${testMClasses.length}개의 클래스 생성 완료`);
      expect(testMClasses).toHaveLength(5);
      console.log("🎉 모든 테스트 데이터 생성 완료!");
    } catch (error) {
      console.error("테스트 데이터 생성 중 오류 발생:", error);
      throw error;
    }
  });
});
