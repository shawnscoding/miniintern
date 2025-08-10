import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/signup", UserController.signup);
router.post("/login", UserController.login);
router.get(
  "/applications",
  authenticateJWT,
  UserController.getUserApplications
);

export default router;
