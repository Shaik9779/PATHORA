
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const jobRoutes = require("./routes/jobs");
const practiceRoutes = require("./routes/Practice");

const profileRoutes = require("./routes/Profile");
const Profile = require("./models/Profile");



// Load database models before syncing
require("./models/User");
require("./models/Connection");

// Import routes
const authRoutes = require("./routes/auth");
const connectionRoutes = require("./routes/connections");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/jobs", jobRoutes);
app.use("/api/practice", practiceRoutes);

app.use("/api/profile", profileRoutes);

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

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected successfully!");

    await sequelize.sync();
    console.log("✅ Database tables synchronized!");

    app.listen(PORT, () => {
      console.log(`🚀 Pathora server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Startup failed:", error);
    process.exitCode = 1;
  }
}

startServer();
