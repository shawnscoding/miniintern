import { AppDataSource } from "../config/ormconfig";
import { Application } from "../models/Application";
import { MClass } from "../models/MClass";
import { User } from "../models/User";
import { EntityManager } from "typeorm";
import createError from "http-errors";
import { DataSource } from "typeorm";

export const ApplyService = {
  apply: async (userId: number, mclassId: number) => {
    return AppDataSource.transaction("READ COMMITTED", async (manager) => {
      const applicationRepo = manager.getRepository(Application);
      const mclassRepo = manager.getRepository(MClass);
      try {
        // 선검사
        const mclass = await mclassRepo.findOneBy({ id: mclassId });
        const isApplied = await applicationRepo.findOneBy({
          userId,
          mclassId,
        });
        if (!mclass) throw new createError.NotFound("class");
        if (isApplied) throw new createError.Conflict("already_applied");
        if (mclass.endAt <= new Date())
          throw new createError.BadRequest("closed");
        if (mclass.appliedParticipants >= mclass.maxParticipants)
          throw new createError.Conflict("full");

        // 행 잠금
        const mcls = await mclassRepo.findOne({
          where: { id: mclassId },
          lock: { mode: "pessimistic_write" },
        });
        if (!mcls) throw new createError.NotFound("class");

        // 재검사
        if (mcls.endAt <= new Date())
          throw new createError.BadRequest("closed");
        if (mcls.appliedParticipants >= mcls.maxParticipants)
          throw new createError.Conflict("full");

        // 신청
        await applicationRepo.insert({ userId, mclassId });

        // 좌석 증가
        await mclassRepo.update(mclassId, {
          appliedParticipants: () => "appliedParticipants + 1",
        });

        return { ok: true };
      } catch (error) {
        throw error;
      }
    });
  },
};
