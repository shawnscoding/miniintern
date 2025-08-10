import { Application } from "../models/Application";
import { AppDataSource } from "../config/ormconfig";
import { MClass } from "../models/MClass";
import createError from "http-errors";

export const MClassService = {
  createMClass: async (data: Partial<MClass>) => {
    const repo = AppDataSource.getRepository(MClass);
    const mclass = repo.create(data);
    const result = await repo.save(mclass);
    return { id: result.id };
  },

  getMClasses: async (pageNo: number = 1, pageSize: number = 20) => {
    const repo = AppDataSource.getRepository(MClass);
    const safePageNo = Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 1;
    const safePageSize =
      Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20;
    const skip = (safePageNo - 1) * safePageSize;

    // 정렬 기준이 명확 하지 않기 때문에 createdAt 역순으로 정렬
    return repo.find({
      skip,
      take: safePageSize,
      order: { createdAt: "DESC" },
      select: [
        "id",
        "mclassCode",
        "title",
        "maxParticipants",
        "appliedParticipants",
        "hostId",
        "startAt",
        "endAt",
      ],
    });
  },

  getMClassById: async (id: number, userId: number, isAdmin: number) => {
    const repo = AppDataSource.getRepository(MClass);

    if (isAdmin === 1) {
      return repo.findOne({ where: { id } });
    }

    const mclass = await repo.findOne({ where: { id } });
    if (!mclass)
      throw new createError.BadRequest("존재하지 않는 클래스입니다.");
    if (mclass.hostId === userId) {
      return mclass;
    }

    const appRepo = AppDataSource.getRepository(Application);
    const applied = await appRepo.findOneBy({ userId, mclassId: id });

    if (applied) {
      return mclass;
    }
    throw new createError[403]("권한이 없습니다.");
  },

  deleteMClass: async (id: number) => {
    const repo = AppDataSource.getRepository(MClass);
    return repo.delete(id);
  },
};
