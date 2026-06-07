import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const threadSchema = new mongoose.Schema({
    threadId: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
    default: "New Thread",
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  messages: [messageSchema],
});

export default mongoose.model("Thread", threadSchema);