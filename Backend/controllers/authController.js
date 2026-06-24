
import User from "../models/User.js";
import Rag from "../models/RagDoc.js"
import Document from "../models/Document.js"
import Thread from "../models/Thread.js"
import fs from "fs";
import { log } from "console";
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(
      newUser,
      password
    );

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          username: registeredUser.username,
          email: registeredUser.email,
        },
      });
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
export const signin= (req, res) => {
  console.log(req.user);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
}
export const me= (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({
      authenticated: false,
      user: null,
    });
  }

  res.json({
    authenticated: true,
    user: {
      username: req.user.username,
      email: req.user.email,
    },
  });
}
export const logout= (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Logout failed",
        });
      }

      res.clearCookie("connect.sid");

      res.json({
        success: true,
        message: "Logged out successfully",
      });
    });
  });
}
export const accountDlt=async(req,res)=>{  
  const userId = req.user._id;

// Get all user documents first
const docs = await Document.find({
  user_id: userId,
});

// Delete physical files
for (const doc of docs) {
  fs.unlink(doc.filePath, (err) => {
    if (err) {
      console.error(
        "FILE DELETE ERROR:",
        err.message
      );
    }
  });
}

// Delete all RAG chunks
await Rag.deleteMany({
  user_id: userId,
});

// Delete all document metadata
await Document.deleteMany({
  user_id: userId,
});

// Delete all threads
await Thread.deleteMany({
  user_id: userId,
});

// Delete user
await User.findByIdAndDelete(userId);
//logout user
req.logout((err) => {
  if (err) {
    return next(err);
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Account deleted but logout failed",
      });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });})})
}