import { Router } from "express";
import { MClassController } from "../controllers/mclass.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { requireAdmin } from "../middlewares/admin.middleware";

const router = Router();

router.post("/", authenticateJWT, requireAdmin, MClassController.createMClass);

router.post("/:id/apply", authenticateJWT, MClassController.applyClass);

router.get("/", MClassController.listMClasses);
router.get("/:id", authenticateJWT, MClassController.getMClassDetail);
router.delete(
  "/:id",
  authenticateJWT,
  requireAdmin,
  MClassController.removeMClass
);

export default router;
