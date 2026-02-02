const express = require("express");
const helmet = require("helmet");
const http = require("http");
const cors = require("cors");
//wsServer
const wsServer = require("./ws/wsServer");
//Routes
const quizRouter = require("./routes/quiz");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/authRoutes");

const app = express();

// Configure CORS to allow frontend origin
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Configure helmet with less restrictive settings for development
app.use(helmet({
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false
}));

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/quiz", quizRouter);

const server = http.createServer(app);

wsServer(server);

server.listen(3000, () => {
  console.log("server running at port 3000");
});
