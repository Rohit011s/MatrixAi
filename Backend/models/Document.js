import mongoose from "mongoose";
const documentSchema=new mongoose.Schema({
  fileName:{type:String,required:true},
  filePath:{type:String,required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    uploaded_at:{type:Date,default:Date.now}
})
export default mongoose.model("Document",documentSchema);