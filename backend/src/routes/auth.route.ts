import { Router } from "express";

import {
  confirmUser,
  email,
  requestEmailVerification,
  resetPasswordRequest,
  login,
  logout,
  resetPassword,
  signup,
} from "../controllers/auth.controller.js";

const router = Router();

router.get("/email", email);
router.post("/login", login);
router.post("/signup", signup);
router.post("/request-email-verification", requestEmailVerification);
router.post("/confirm-user", confirmUser);
router.post("/request-password-reset", resetPasswordRequest);
router.patch("/reset-password", resetPassword);
router.post("/logout", logout);

export default router;
