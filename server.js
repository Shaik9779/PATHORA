
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// Import routes
const jobRoutes = require("./routes/jobs");
const practiceRoutes = require("./routes/practice");
const profileRoutes = require("./routes/profile");
const authRoutes = require("./routes/auth");
const connectionRoutes = require("./routes/connections");

// Load database models before syncing
require("./models/user");
require("./models/Connection");
require("./models/Profile");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow local development and deployed Vercel frontends
const allowedOrigins = [
  "http://localhost:5173",
  "https://pathora-joiu.vercel.app",
  "https://pathora-2psw.vercel.app",
  "https://pathora-2bps.vercel.app",
  "https://pathora-puce.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.error(`❌ CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "success",
    message: "Pathora backend is running!",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/practice", practiceRoutes);
app.use("/api/profile", profileRoutes);

// Start server after database connection succeeds
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully!");

    await sequelize.sync();
    console.log("✅ Database tables synchronized!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Pathora server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exit(1);
  }
}

startServer();
