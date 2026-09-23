import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { query } from "../db.js";
import { sendEmail, passwordResetEmail } from "../utils/email.js";

const router = Router();

function signToken(admin) {
  return jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { rows } = await query("SELECT * FROM admins WHERE email = $1", [email.toLowerCase()]);
    const admin = rows[0];
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(admin);
    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ admin: payload });
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const { rows } = await query("SELECT * FROM admins WHERE email = $1", [email?.toLowerCase()]);
    const admin = rows[0];

    // Always respond the same way, whether or not the account exists.
    if (admin) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      await query(
        "UPDATE admins SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
        [resetToken, expires, admin.id]
      );
      const resetUrl = `${process.env.CLIENT_URL}/admin/reset-password?token=${resetToken}`;
      await sendEmail({
        to: admin.email,
        subject: "Reset your RMU SRC admin password",
        html: passwordResetEmail(resetUrl),
      });
    }

    res.json({ message: "If that account exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not process request" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and new password are required" });
    }

    const { rows } = await query(
      "SELECT * FROM admins WHERE reset_token = $1 AND reset_token_expires > now()",
      [token]
    );
    const admin = rows[0];
    if (!admin) return res.status(400).json({ error: "Reset link is invalid or has expired" });

    const password_hash = await bcrypt.hash(password, 10);
    await query(
      "UPDATE admins SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
      [password_hash, admin.id]
    );

    res.json({ message: "Password updated. You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not reset password" });
  }
});

export default router;
