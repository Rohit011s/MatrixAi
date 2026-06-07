import mongoose from "mongoose";
const RagSchema = new mongoose.Schema({
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  source: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
});
export default mongoose.model("Rag",RagSchema);
