import { AppDataSource } from "../config/ormconfig";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Application } from "../models/Application";

export const UserService = {
  registerUser: async (email: string, password: string, isAdmin: 0 | 1 = 0) => {
    const userRepo = AppDataSource.getRepository(User);
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) throw new Error("이미 존재하는 이메일입니다.");
    const hashed = await bcrypt.hash(password, 10);
    const user = userRepo.create({ email, password: hashed, isAdmin });
    await userRepo.save(user);
    return user;
  },

  loginUser: async (email: string, password: string) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });
    if (!user) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    return { token, userId: user.id };
  },

  getUserApplications: async (
    userId: number,
    pageNo: number = 1,
    pageSize: number = 20
  ) => {
    const appRepo = AppDataSource.getRepository(Application);
    const safePageNo = Number.isFinite(pageNo) && pageNo > 0 ? pageNo : 1;
    const safePageSize =
      Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 20;
    const skip = (safePageNo - 1) * safePageSize;

    const result = await appRepo
      .createQueryBuilder("a")
      .leftJoin("a.mclass", "m")
      .where("a.userId = :userId", { userId })
      .orderBy("a.createdAt", "DESC")
      .skip(skip)
      .take(safePageSize)
      .select([
        "a.id AS id",
        "a.createdAt AS createdAt",
        "m.id AS mclassId",
        "m.mclassCode AS mclassCode",
        "m.title AS title",
        "m.hostId AS hostId",
      ])
      .getRawMany();

    return result;
  },
};
