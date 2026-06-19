import Thread from "../models/Thread.js";
// Get all threads
export const getThreads=async (req, res) => {
  try {
    //find and  sort as recent thread first
    const threads = await Thread.find({
      user_id: req.user._id,
    }).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (error) {
  console.error("THREAD ERROR:", error.message);

  res.status(500).json({
    error: "Failed to fetch threads",
  });
}
}
// Get messages from a specific thread
export const getThreadMessages=async (req, res) => {
  try {
    const { threadId } = req.params;
    const thread = await Thread.findOne({
      threadId,
      user_id: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (error) {
  console.error(
    "THREAD MESSAGE ERROR:",
    error.message
  );

  res.status(500).json({
    error: "Failed to fetch thread",
  });
}
}
export const deleteThread=async (req, res) => {
  try {
    const { threadId } = req.params;

    const thread = await Thread.findOneAndDelete({
      threadId,
      user_id: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({
      message: "Thread deleted successfully",
    });
  } catch (error) {
  console.error(
    "THREAD DELETE ERROR:",
    error.message
  );

  res.status(500).json({
    error: "Failed to delete thread",
  });
}
}