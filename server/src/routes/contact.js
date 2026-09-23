import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// POST /api/contact — public: submit the "Get in touch" form
router.post("/", asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required" });
  }
  const { rows } = await query(
    `INSERT INTO contact_messages (name, email, subject, message) VALUES ($1,$2,$3,$4) RETURNING *`,
    [name, email, subject, message]
  );
  res.status(201).json({ message: "Thanks — the council has received your message.", data: rows[0] });
}));

// GET /api/contact — admin: list messages
router.get("/", requireAdmin, asyncHandler(async (req, res) => {
  const { rows } = await query("SELECT * FROM contact_messages ORDER BY created_at DESC");
  res.json(rows);
}));

// PUT /api/contact/:id/read — admin: mark as read
router.put("/:id/read", requireAdmin, asyncHandler(async (req, res) => {
  const { rows } = await query(
    "UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Message not found" });
  res.json(rows[0]);
}));

// DELETE /api/contact/:id — admin
router.delete("/:id", requireAdmin, asyncHandler(async (req, res) => {
  await query("DELETE FROM contact_messages WHERE id = $1", [req.params.id]);
  res.status(204).send();
}));

export default router;
