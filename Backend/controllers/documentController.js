import fs from "fs";
import Document from "../models/Document.js";
import Rag from "../models/RagDoc.js";
import saveDoc from "../services/saveDocs.js";
export const uploadDocument=async (req, res) => {
    try {
      // Ensure a file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      // Save document metadata
      const doc = await Document.create({
        fileName: req.file.originalname,
        filePath: req.file.path,
        user_id: req.user._id,
      });

      // Generate chunks and embeddings
      await saveDoc(
        req.file.path,
        req.file.originalname,
        doc._id,
        req.user._id
      );

      return res.json({
        success: true,
        message: "File uploaded successfully",
      });
    } catch (error) {
      console.error(
        "UPLOAD ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to upload file",
      });
    }
  };

export const getDocuments= async (req, res) => {
  const docs = await Document.find({
    user_id: req.user._id,
  });

  res.json(docs);
};
export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete all vector chunks linked to this document
    await Rag.deleteMany({
      document_id: req.params.id,
    });

    // Delete uploaded file from disk
    fs.unlink(doc.filePath, (err) => {
      if (err) {
        console.error(
          "FILE DELETE ERROR:",
          err.message
        );
      }
    });

    // Delete document metadata
    await Document.findByIdAndDelete(
      req.params.id
    );

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error(
      "DOCUMENT DELETE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete document",
    });
  }
};