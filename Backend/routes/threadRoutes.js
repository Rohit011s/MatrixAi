import express from "express";

import {
  getThreads,
  getThreadMessages,
  deleteThread,
} from "../controllers/threadController.js";

import isLoggedIn from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/thread",
  isLoggedIn,
  getThreads
);

router.get(
  "/thread/:threadId",
  isLoggedIn,
  getThreadMessages
);

router.delete(
  "/thread/:threadId",
  isLoggedIn,
  deleteThread
);

export default router;