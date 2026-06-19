import mongoose from "mongoose";
const RagSchema = new mongoose.Schema({
  document_id:{type:mongoose.Schema.Types.ObjectId,ref:"Document",required:true},
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
  source: { type: String, required: true },
  chunkIndex: { type: Number, required: true },
  user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});
export default mongoose.model("Rag",RagSchema);
