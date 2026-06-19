import Thread from "../models/Thread.js";
import geminiService from "../services/geminiService.js";
import RagProcess from "../utils/rag.js";
// Send message and get AI response
export const chat= async (req, res) => {
  try {
    const {
      threadId,
      message,
      rag,
      selectedfiles,
    } = req.body;

    // Validate request
    if (!threadId || !message?.trim()) {
      return res.status(400).json({
        error: "Message and threadId are required",
      });
    }

    // Validate file selection when RAG is enabled
    if (
      rag &&
      (!selectedfiles || selectedfiles.length === 0)
    ) {
      return res.status(400).json({
        error: "Please select at least one file.",
      });
    }

    // Find existing thread
    let thread = await Thread.findOne({
      threadId,
      user_id: req.user._id,
    });

    // Create new thread if it doesn't exist
    if (!thread) {
      thread = new Thread({
        threadId,
        user_id: req.user._id,
        title: message,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      });
    } else {
      thread.messages.push({
        role: "user",
        content: message,
      });
    }

    let assistantReply;

    // RAG Mode
    if (rag) {
      assistantReply = await RagProcess(
        message,
        selectedfiles,
        req.user._id
      );
    }

    // Normal Gemini Chat
    else {
      const response = await geminiService(message);

      if (!response.success) {
        assistantReply =
          "Gemini service is temporarily unavailable. Please try again.";
      } else {
        assistantReply =
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      }
    }

    // Final safety check
    if (!assistantReply) {
      assistantReply = "No response generated.";
    }

    // Save assistant response
    thread.messages.push({
      role: "assistant",
      content: assistantReply,
    });

    thread.updatedAt = new Date();

    await thread.save();

    return res.json({
      reply: assistantReply,
    });
  } catch (error) {
    console.error(
      "CHAT ROUTE ERROR:",
      error.message
    );

    return res.status(500).json({
      reply:
        "An unexpected server error occurred. Please try again.",
    });
  }
};