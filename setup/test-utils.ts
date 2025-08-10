import request from "supertest";
import app from "../src/app";
import { User } from "../src/models/User";
import { AppDataSource } from "../src/config/ormconfig";

export interface TestUser {
  id: number;
  email: string;
  password: string;
  isAdmin: number;
}

export interface TestMClass {
  id: number;
  mclassCode: string;
  title: string;
  description: string;
  maxApplicants: number;
  startAt: string;
  endAt: string;
  hostId: number;
}

export class SetupUtils {
  static async createUser(userData: Partial<TestUser>) {
    await AppDataSource.manager.delete(User, { id: userData.id });

    // 회원가입
    return await request(app).post("/api/users/signup").send({
      email: userData.email,
      password: userData.password,
      isAdmin: userData.isAdmin,
    });
  }

  static async createMClass(
    mclassData: TestMClass,
    adminToken: string
  ): Promise<TestMClass> {
    const res = await request(app)
      .post("/api/mclasses")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(mclassData);

    return {
      ...mclassData,
      id: res.body.id,
    };
  }

  static async createApplication(userToken: string, mclassId: number) {
    return request(app)
      .post(`/api/mclasses/${mclassId}/apply`)
      .set("Authorization", `Bearer ${userToken}`);
  }

  static generateTestUsers(count: number): TestUser[] {
    const users: TestUser[] = [];
    for (let i = 1; i <= count; i++) {
      users.push({
        id: i,
        email: `user${i}@example.com`,
        password: `password_${i}`,
        isAdmin: i === 1 ? 1 : 0, // 첫 번째 유저만 관리자
      });
    }
    return users;
  }

  static generateTestMClasses(count: number): TestMClass[] {
    const mclasses: TestMClass[] = [];
    const now = new Date();

    for (let i = 1; i <= count; i++) {
      mclasses.push({
        id: i,
        mclassCode: `TE-02-0${i}`,
        title: `테스트 클래스 ${i}`,
        description: `테스트 클래스 ${i} 설명`,
        maxApplicants: 100,
        hostId: 2,
        startAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1시간 전
        endAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7일 후
      });
    }
    return mclasses;
  }
}
