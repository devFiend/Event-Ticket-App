import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import ticketRoutes from "./routes/tickets.js"; // Ticket Routes
import eventRoutes from "./routes/events.js";
import adminRoutes from "./routes/admin.js";
import paymentRoutes from "./routes/payment.js";
import dashboardRoutes from "./routes/dashboard.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files
app.set("view engine", "ejs"); // Set EJS as templating engine

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/tickets", ticketRoutes);
app.use("/", eventRoutes);
app.use("/admin", adminRoutes);
app.use("/", paymentRoutes);
app.use("/", dashboardRoutes);

// Home Route
app.get("/", (req, res) => {
  res.render("index"); // Render homepage
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// 🚀 Server running on port 5000