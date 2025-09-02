import { Router } from "express";

import {
  me,
  login,
  signup,
  confirmSignup,
  resetPassword,
  forgotPassword,
  logout,
  refresh,
  confirmForgotPassword,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/me", authenticate, me);
router.post("/login", login);
router.post("/signup", signup);
router.post("/confirm-signup/:code", confirmSignup);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-forgot-password/:code", confirmForgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
