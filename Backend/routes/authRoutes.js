import express from "express";
import passport from "passport";

import {
  signup,
  signin,
  me,
  logout,
  accountDlt,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post(
  "/signin",
  passport.authenticate("local", {
    failWithError: true,
  }),
  signin,
  (err, req, res, next) => {
    res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }
);

router.get("/me", me);

router.post("/logout", logout);
router.delete("/user",accountDlt);
export default router;