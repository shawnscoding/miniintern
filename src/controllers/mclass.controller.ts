import { Request, Response, NextFunction } from "express";
import { MClassService } from "../services/mclass.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { ApplyService } from "../services/application.service";

export const MClassController = {
  createMClass: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const { title, mclassCode, description, maxApplicants, startAt, endAt } =
        req.body;
      const result = await MClassService.createMClass({
        title,
        description,
        mclassCode,
        maxParticipants: maxApplicants,
        appliedParticipants: 0,
        startAt,
        endAt,
        hostId: userId,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  listMClasses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageNo = req.query.pageNo ? Number(req.query.pageNo) : 1;
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
      const mclasses = await MClassService.getMClasses(pageNo, pageSize);
      res.json(mclasses);
    } catch (err) {
      next(err);
    }
  },

  getMClassDetail: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) res.status(500).end();
      const id = Number(req.params.id);
      const mclass = await MClassService.getMClassById(
        id,
        req.user?.id as number,
        req.user?.isAdmin as number
      );
      if (!mclass) return res.status(400).json({ message: "Not found" });
      res.json(mclass);
    } catch (err) {
      next(err);
    }
  },

  removeMClass: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await MClassService.deleteMClass(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  applyClass: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?.id || 1;
      const classId = Number(req.params.id);

      const result = await ApplyService.apply(userId, classId);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
};
