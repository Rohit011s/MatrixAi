import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import geminiService from "./services/geminiService.js";
import chatRoutes from "./routes/chat.js";
import saveDoc from "./services/saveDocs.js";
import retriveDoc from "./services/retriveDoc.js";
import RagProcess from "./utils/rag.js";
import Rag from "./models/RagDoc.js"
const filepath="./utils/computer.txt"
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);


app.get("/", async (req, res) => {
  //    let data = await GenerateContent("tell me a joke");
  let data = "hellow world";
  res.send(data);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB successfully");

 
    // saveDoc(filepath);
    // console.log("save succesfully");
    // const answer = await RagProcess("was is rohit secret code");
    // console.log(answer);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
