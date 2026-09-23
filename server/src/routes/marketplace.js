import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET /api/marketplace — public (?featured=true&category=Apparel)
router.get("/", asyncHandler(async (req, res) => {
  const { featured, category } = req.query;
  const conditions = ["is_active = true"];
  const params = [];

  if (featured === "true") conditions.push("featured = true");
  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  const sql = `SELECT * FROM marketplace_items WHERE ${conditions.join(" AND ")} ORDER BY created_at DESC`;
  const { rows } = await query(sql, params);
  res.json(rows);
}));

// GET /api/marketplace/:id — public
router.get("/:id", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM marketplace_items WHERE id = $1", [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: "Item not found" });
  res.json(rows[0]);
}));

// POST /api/marketplace — admin only (per project spec, only admins list items)
router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const { name, description, price_ghs, image_url, category, stock, featured } = req.body;
  const { rows } = await query(
    `INSERT INTO marketplace_items (name, description, price_ghs, image_url, category, stock, featured)
     VALUES ($1,$2,$3,$4,$5,COALESCE($6,0),COALESCE($7,false)) RETURNING *`,
    [name, description, price_ghs, image_url, category, stock, featured]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/marketplace/:id — admin
router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { name, description, price_ghs, image_url, category, stock, featured, is_active } = req.body;
  const { rows } = await query(
    `UPDATE marketplace_items SET
       name = COALESCE($1, name),
       description = COALESCE($2, description),
       price_ghs = COALESCE($3, price_ghs),
       image_url = COALESCE($4, image_url),
       category = COALESCE($5, category),
       stock = COALESCE($6, stock),
       featured = COALESCE($7, featured),
       is_active = COALESCE($8, is_active)
     WHERE id = $9 RETURNING *`,
    [name, description, price_ghs, image_url, category, stock, featured, is_active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Item not found" });
  res.json(rows[0]);
}));

// DELETE /api/marketplace/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM marketplace_items WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

export default router;
