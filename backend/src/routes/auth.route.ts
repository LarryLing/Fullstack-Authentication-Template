import { Router } from "express";

import {
  email,
  login,
  logout,
  resetPassword,
  signup,
  refresh,
  confirmEmail,
  forgotPassword,
  me,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, me);
router.get("/email", email);
router.post("/signup", signup);
router.post("/confirm-email", confirmEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
