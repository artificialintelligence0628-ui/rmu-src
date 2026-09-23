import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/news — public (?featured=true&limit=4)
router.get("/", asyncHandler(async (req, res) => {
  const { featured, limit } = req.query;
  let sql = "SELECT * FROM news";
  const params = [];
  if (featured === "true") {
    sql += " WHERE featured = true";
  }
  sql += " ORDER BY published_at DESC";
  if (limit) {
    params.push(Number(limit));
    sql += ` LIMIT $${params.length}`;
  }
  const { rows } = await query(sql, params);
  res.json(rows);
}));

// GET /api/news/:slug — public
router.get("/:slug", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM news WHERE slug = $1", [req.params.slug]);
  if (!rows[0]) return res.status(404).json({ error: "Article not found" });
  res.json(rows[0]);
}));

// POST /api/news — admin
router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const { title, excerpt, content, image_url, category, featured, published_at } = req.body;
  const slug = slugify(title) + "-" + Date.now().toString(36);
  const { rows } = await query(
    `INSERT INTO news (title, slug, excerpt, content, image_url, category, featured, published_at)
     VALUES ($1,$2,$3,$4,$5,$6,COALESCE($7,false),COALESCE($8, now())) RETURNING *`,
    [title, slug, excerpt, content, image_url, category, featured, published_at]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/news/:id — admin
router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { title, excerpt, content, image_url, category, featured, published_at } = req.body;
  const { rows } = await query(
    `UPDATE news SET
       title = COALESCE($1, title),
       excerpt = COALESCE($2, excerpt),
       content = COALESCE($3, content),
       image_url = COALESCE($4, image_url),
       category = COALESCE($5, category),
       featured = COALESCE($6, featured),
       published_at = COALESCE($7, published_at)
     WHERE id = $8 RETURNING *`,
    [title, excerpt, content, image_url, category, featured, published_at, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Article not found" });
  res.json(rows[0]);
}));

// DELETE /api/news/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM news WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

export default router;
