import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET /api/events — public (?upcoming=true&featured=true)
router.get("/", asyncHandler(async (req, res) => {
  const { upcoming, featured } = req.query;
  const conditions = [];
  const params = [];

  if (upcoming === "true") {
    conditions.push("event_date >= CURRENT_DATE");
  }
  if (featured === "true") {
    conditions.push("featured = true");
  }

  let sql = "SELECT * FROM events";
  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY event_date ASC";

  const { rows } = await query(sql, params);
  res.json(rows);
}));

// GET /api/events/:id — public
router.get("/:id", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM events WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Event not found" });
  res.json(rows[0]);
}));

// POST /api/events — admin
router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const { title, description, event_date, start_time, end_time, location, image_url, register_url, featured } = req.body;
  const { rows } = await query(
    `INSERT INTO events (title, description, event_date, start_time, end_time, location, image_url, register_url, featured)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,COALESCE($9,false)) RETURNING *`,
    [title, description, event_date, start_time, end_time, location, image_url, register_url, featured]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/events/:id — admin
router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { title, description, event_date, start_time, end_time, location, image_url, register_url, featured } = req.body;
  const { rows } = await query(
    `UPDATE events SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       event_date = COALESCE($3, event_date),
       start_time = COALESCE($4, start_time),
       end_time = COALESCE($5, end_time),
       location = COALESCE($6, location),
       image_url = COALESCE($7, image_url),
       register_url = COALESCE($8, register_url),
       featured = COALESCE($9, featured)
     WHERE id = $10 RETURNING *`,
    [title, description, event_date, start_time, end_time, location, image_url, register_url, featured, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Event not found" });
  res.json(rows[0]);
}));

// DELETE /api/events/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM events WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

export default router;
