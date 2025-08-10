import "reflect-metadata";
import "../../config";

import { AppDataSource } from "../../src/config/ormconfig";
import { User } from "../../src/models/User";
import { MClass } from "../../src/models/MClass";
import { Application } from "../../src/models/Application";
import { MClassService } from "../../src/services/mclass.service";
import { ApplyService } from "../../src/services/application.service";
import { In } from "typeorm";

jest.setTimeout(30000);

describe("ApplyService 동시성 - 200명 동시 신청", () => {
  const TOTAL_USERS = 200;
  const CAPACITY = 100;
  let mclassId: number;
  let userIds: number[];

  beforeAll(async () => {
    await AppDataSource.initialize();

    const appRepo = AppDataSource.getRepository(Application);
    const mclassRepo = AppDataSource.getRepository(MClass);

    const users = await AppDataSource.getRepository(User).find({
      select: ["id"],
      take: 200,
    });
    userIds = users.map((el) => el.id);

    const mclass = await mclassRepo.findOneBy({ mclassCode: "TE-02-01" });
    if (!mclass) throw Error("mclass not found, check the test data setup");
    await mclassRepo.update(mclass.id, {
      appliedParticipants: 0,
    });

    await appRepo.delete({
      mclassId: mclass.id,
      userId: In(userIds),
    });

    mclassId = mclass.id;
  });

  afterAll(async () => {
    await AppDataSource.destroy();
  });

  it("동시성 결과 검증", async () => {
    const results = await Promise.allSettled(
      userIds.map((uid) => ApplyService.apply(uid, mclassId))
    );

    const ok = results.filter((r) => r.status === "fulfilled").length;
    const fail = results.filter((r) => r.status === "rejected").length;

    console.log("ok", ok);
    console.log("fail", fail);
    expect(ok).toBe(CAPACITY);
    expect(fail).toBe(TOTAL_USERS - CAPACITY);

    const appRepo = AppDataSource.getRepository(Application);
    const appCnt = await appRepo.count({ where: { mclassId } });
    console.log("appCnt", appCnt);
    expect(appCnt).toBe(CAPACITY);

    const mclassRepo = AppDataSource.getRepository(MClass);
    const mclass = await mclassRepo.findOneBy({ id: mclassId });
    console.log("appliedParticipants", mclass?.appliedParticipants);
    expect(mclass!.appliedParticipants).toBe(CAPACITY);
  });
});
