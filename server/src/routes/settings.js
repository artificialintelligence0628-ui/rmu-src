import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

/* ---------- Site settings (key/value, e.g. stats) ---------- */

// GET /api/settings — public
router.get("/", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM site_settings");
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  res.json(settings);
}));

// PUT /api/settings/:key — admin
router.put("/:key", requireAdmin, asyncHandler(async (req, res) => {
  const { value } = req.body;
  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1,$2)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [req.params.key, value]
  );
  res.json({ key: req.params.key, value });
}));

/* ---------- Industry partners ---------- */

// GET /api/settings/partners/list — public
router.get("/partners/list", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM industry_partners ORDER BY order_index ASC, id ASC");
  res.json(rows);
}));

router.post("/partners", requireAdmin, asyncHandler(async (req, res) => {
  const { name, partner_type, logo_url, order_index } = req.body;
  const { rows } = await query(
    `INSERT INTO industry_partners (name, partner_type, logo_url, order_index)
     VALUES ($1,$2,$3,COALESCE($4,0)) RETURNING *`,
    [name, partner_type, logo_url, order_index]
  );
  res.status(201).json(rows[0]);
}));

router.delete("/partners/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM industry_partners WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

/* ---------- Student services ---------- */

router.get("/services/list", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM student_services ORDER BY order_index ASC, id ASC");
  res.json(rows);
}));

router.post("/services", requireAdmin, asyncHandler(async (req, res) => {
  const { title, description, icon, order_index } = req.body;
  const { rows } = await query(
    `INSERT INTO student_services (title, description, icon, order_index)
     VALUES ($1,$2,COALESCE($3,'HelpCircle'),COALESCE($4,0)) RETURNING *`,
    [title, description, icon, order_index]
  );
  res.status(201).json(rows[0]);
}));

router.delete("/services/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM student_services WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

/* ---------- Constitution ---------- */

router.get("/constitution/current", asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM constitution ORDER BY updated_at DESC LIMIT 1");
  res.json(rows[0] || null);
}));

router.post("/constitution", requireAdmin, asyncHandler(async (req, res) => {
  const { pdf_url, version_label } = req.body;
  const { rows } = await query(
    `INSERT INTO constitution (pdf_url, version_label) VALUES ($1,$2) RETURNING *`,
    [pdf_url, version_label]
  );
  res.status(201).json(rows[0]);
}));

export default router;
