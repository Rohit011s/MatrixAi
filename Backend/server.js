import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { GenerateContent } from "./services/geminiService.js";
import chatRoutes from "./routes/chat.js";
import saveDoc from "./utils/rag.js";
const app = express();
const PORT = process.env.PORT||8080;
saveDoc("./utils/computer.txt");


app.use(express.json());
app.use(cors());
app.use('/api', chatRoutes);
app.get("/", async (req, res) => {
//    let data = await GenerateContent("tell me a joke");
let data ="hellow world";
    res.send(data);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
});
const connectDB = async () => {
    try{await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB successfully");
    }
    catch(error){console.error("Error connecting to MongoDB:", error);}
}
