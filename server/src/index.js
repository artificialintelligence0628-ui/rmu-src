import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import executivesRoutes from "./routes/executives.js";
import newsRoutes from "./routes/news.js";
import eventsRoutes from "./routes/events.js";
import marketplaceRoutes from "./routes/marketplace.js";
import ordersRoutes from "./routes/orders.js";
import contactRoutes from "./routes/contact.js";
import uploadRoutes from "./routes/upload.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "5mb" }));

// ---- Health check (used by render.yaml) ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// ---- API routes ----
app.use("/api/auth", authRoutes);
app.use("/api/executives", executivesRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/settings", settingsRoutes);

// ---- Serve built frontend in production (single Render web service) ----
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "../../client/dist");
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`RMU SRC API running on port ${PORT}`);
});

// Extra safety net: log instead of silently dying if something slips through
// (every route is wrapped in asyncHandler, so this should rarely fire).
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});
