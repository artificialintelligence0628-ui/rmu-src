import { Router } from "express";
import { query } from "../db.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { verifyPaystackTransaction } from "../utils/paystack.js";
import { sendEmail, orderConfirmationEmail } from "../utils/email.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// POST /api/orders/init
// Frontend calls this first to create a pending order server-side
// (so price + stock are validated against the DB, not trusted from the client),
// then uses the returned amount with the Paystack popup (VITE_PAYSTACK_PUBLIC_KEY).
router.post("/init", asyncHandler(async (req, res) => {
  const { item_id, buyer_name, buyer_email, buyer_phone, quantity } = req.body;
  if (!item_id || !buyer_name || !buyer_email) {
    return res.status(400).json({ error: "item_id, buyer_name and buyer_email are required" });
  }
  const qty = Math.max(1, Number(quantity) || 1);

  const { rows: itemRows } = await query(
    "SELECT * FROM marketplace_items WHERE id = $1 AND is_active = true",
    [item_id]
  );
  const item = itemRows[0];
  if (!item) return res.status(404).json({ error: "Item not found or unavailable" });
  if (item.stock !== null && item.stock < qty) {
    return res.status(400).json({ error: "Not enough stock available" });
  }

  const total = Number(item.price_ghs) * qty;

  const { rows } = await query(
    `INSERT INTO orders (item_id, buyer_name, buyer_email, buyer_phone, quantity, total_amount_ghs, status)
     VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING *`,
    [item_id, buyer_name, buyer_email, buyer_phone, qty, total]
  );

  res.status(201).json({
    order: rows[0],
    amount_kobo: Math.round(total * 100), // GHS -> pesewas, Paystack expects the smallest currency unit
  });
}));

// POST /api/orders/verify
// Frontend calls this after the Paystack popup succeeds, passing the reference it returned.
router.post("/verify", asyncHandler(async (req, res) => {
  const { order_id, reference } = req.body;
  if (!order_id || !reference) {
    return res.status(400).json({ error: "order_id and reference are required" });
  }

  const verification = await verifyPaystackTransaction(reference);
  const paid = verification?.data?.status === "success";

  const { rows } = await query(
    `UPDATE orders SET status = $1, paystack_reference = $2 WHERE id = $3 RETURNING *`,
    [paid ? "paid" : "failed", reference, order_id]
  );
  const order = rows[0];
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (paid) {
    // Decrement stock
    await query("UPDATE marketplace_items SET stock = GREATEST(stock - $1, 0) WHERE id = $2", [
      order.quantity,
      order.item_id,
    ]);

    const { rows: itemRows } = await query("SELECT name FROM marketplace_items WHERE id = $1", [order.item_id]);
    await sendEmail({
      to: order.buyer_email,
      subject: "Your RMU SRC Marketplace order is confirmed",
      html: orderConfirmationEmail({
        buyerName: order.buyer_name,
        itemName: itemRows[0]?.name || "Item",
        quantity: order.quantity,
        total: order.total_amount_ghs,
        reference,
      }),
    });
  }

  res.json({ order, verified: paid });
}));

// GET /api/orders — admin: view all orders
router.get("/", requireAdmin, asyncHandler(async (req, res) => {
  const { rows } = await query(
    `SELECT o.*, m.name AS item_name FROM orders o
     LEFT JOIN marketplace_items m ON m.id = o.item_id
     ORDER BY o.created_at DESC`
  );
  res.json(rows);
}));

export default router;
