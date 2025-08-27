import { Router } from "express";

import {
  confirmUser,
  email,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
} from "../controllers/auth-controllers.js";

const router = Router();

router.get("/email", email);
router.post("/login", login);
router.post("/signup", signup);
router.post("/confirm-user", confirmUser);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.post("/logout", logout);

export default router;
