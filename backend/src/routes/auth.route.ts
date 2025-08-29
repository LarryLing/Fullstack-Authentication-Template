import { Router } from "express";

import {
  confirmForgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  refresh,
  confirmSignup,
  forgotPassword,
  me,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, me);
router.post("/login", login);
router.post("/signup", signup);
router.post("/signup/confirm/:code", confirmSignup);
router.post("/forgot-password", forgotPassword);
router.post("/forgot-password/confirm/:code", confirmForgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
