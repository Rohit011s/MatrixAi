import express from "express";

import { chat } from "../controllers/chatController.js";

import isLoggedIn from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/chat",
  isLoggedIn,
  chat
);

export default router;