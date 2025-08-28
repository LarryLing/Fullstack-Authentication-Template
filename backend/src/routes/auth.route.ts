import { Router } from "express";

import {
  email,
  requestPasswordReset,
  login,
  logout,
  resetPassword,
  signup,
  requestEmailVerification,
  refresh,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/email", email);
router.post("/email-verification", requestEmailVerification);
router.post("/signup", signup);
router.post("/login", login);
router.post("/password-reset", requestPasswordReset);
router.patch("/password", resetPassword);
router.post("/logout", logout);
router.post("/refresh", refresh);

export default router;
