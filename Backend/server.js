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
const isProduction = process.env.NODE_ENV === "production";
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  },
};

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
/*
  Middleware
*/
app.use(express.json());
app.use(
  cors({
     origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);
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
app.get("/test-session", (req, res) => {
  console.log("Session:", req.session);
  console.log("Passport:", req.session?.passport);
  console.log("User:", req.user);

  res.json({
    session: req.session,
    passport: req.session?.passport,
    user: req.user,
  });
});
/*
  Start Server
*/
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  await connectDB();
});