import express from "express";

import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/documentController.js";

import upload from "../middleware/upload.js";
import isLoggedIn from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/upload",
  isLoggedIn,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/documents",
  isLoggedIn,
  getDocuments
);

router.delete(
  "/documents/:id",
  isLoggedIn,
  deleteDocument
);

export default router;