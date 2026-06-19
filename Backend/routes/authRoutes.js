import express from "express";
import passport from "passport";

import {
  signup,
  signin,
  me,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post(
  "/signin",
  passport.authenticate("local"),
  signin
);

router.get("/me", me);

router.post("/logout", logout);

export default router;