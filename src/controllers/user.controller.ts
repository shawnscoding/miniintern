import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const UserController = {
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, isAdmin } = req.body;
      await UserService.registerUser(email, password, isAdmin);
      res.status(201).end();
    } catch (err) {
      console.error("err", err);
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await UserService.loginUser(email, password);
      res.json(result);
    } catch (err) {
      console.error("err", err);
      next(err);
    }
  },

  getUserApplications: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user!.id!;
      const pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
      const applications = await UserService.getUserApplications(
        userId,
        pageNo,
        pageSize
      );

      res.json(applications);
    } catch (err) {
      console.error("err", err);
      next(err);
    }
  },
};
