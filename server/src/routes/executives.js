import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// GET /api/executives — public
router.get("/", asyncHandler(async (req, res) => {
  const { rows } = await query(
    "SELECT * FROM executives WHERE is_active = true ORDER BY order_index ASC, id ASC"
  );
  res.json(rows);
}));

// POST /api/executives — admin
router.post("/", requireAdmin, asyncHandler(async (req, res) => {
  const { name, position, bio, image_url, order_index } = req.body;
  const { rows } = await query(
    `INSERT INTO executives (name, position, bio, image_url, order_index)
     VALUES ($1,$2,$3,$4,COALESCE($5,0)) RETURNING *`,
    [name, position, bio, image_url, order_index]
  );
  res.status(201).json(rows[0]);
}));

// PUT /api/executives/:id — admin
router.put("/:id", requireAdmin, asyncHandler(async (req, res) => {
  const { name, position, bio, image_url, order_index, is_active } = req.body;
  const { rows } = await query(
    `UPDATE executives SET
       name = COALESCE($1, name),
       position = COALESCE($2, position),
       bio = COALESCE($3, bio),
       image_url = COALESCE($4, image_url),
       order_index = COALESCE($5, order_index),
       is_active = COALESCE($6, is_active)
     WHERE id = $7 RETURNING *`,
    [name, position, bio, image_url, order_index, is_active, req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Executive not found" });
  res.json(rows[0]);
}));

// DELETE /api/executives/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM executives WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

export default router;
