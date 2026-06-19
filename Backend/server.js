import express from "express";
import "dotenv/config";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

import connectDB from "./config/db.js";
import configurePassport from "./config/passport.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import threadRoutes from "./routes/threadRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";

const app = express();
const PORT = process.env.PORT || 8080;

/*
  Session Store
  Stores user sessions in MongoDB.
*/
const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
});

/*
  Session Configuration
*/
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  },
};

/*
  Middleware
*/
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionOptions));

/*
  Passport Authentication
*/
configurePassport();

app.use(passport.initialize());
app.use(passport.session());

/*
  API Routes
*/
app.use("/api", authRoutes);
app.use("/api", chatRoutes);
app.use("/api", threadRoutes);
app.use("/api", documentRoutes);

/*
   Check Route
*/
app.get("/", (req, res) => {
  res.send("hello world");
});

/*
  Start Server
*/
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectDB();
});