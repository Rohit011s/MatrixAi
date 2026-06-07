import express from "express";
import Thread from "../models/Thread.js";
import { GenerateContent } from "../services/geminiService.js";
const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "test-thread-001",
    });
    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    console.error("Error in /test route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ createdAt: -1 });
    res.json(threads);
  } catch (error) {
    console.error("Error in /thread route:", error);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});
router.get("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (error) {
    console.error("Error in /thread/:threadId route:", error);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});
router.delete("/thread/:threadId", async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOneAndDelete({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    console.log(thread + "deleted");
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (error) {
    console.error("Error in /thread/:threadId DELETE route:", error);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;
  if (!threadId || !message) {
    return res.status(400).json({ error: "missing required fields" });
  }
  try {
    let thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    const assistanceReply = await GenerateContent(message);
    thread.messages.push({ role: "assistant", content: assistanceReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: assistanceReply });

  } catch (error) {
    console.error("Error in /chat route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
