import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send:", subject);
    return { skipped: true };
  }
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "RMU SRC <no-reply@rmu.edu.gh>",
    to,
    subject,
    html,
  });
}

export function passwordResetEmail(resetUrl) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2e1a8f;">RMU SRC — Password Reset</h2>
      <p>We received a request to reset your admin password. Click below to choose a new one. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}" style="background:#2e1a8f;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;display:inline-block;">Reset Password</a></p>
      <p style="color:#888;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
    </div>
  `;
}

export function orderConfirmationEmail({ buyerName, itemName, quantity, total, reference }) {
  return `
    <div style="font-family: Georgia, serif; max-width: 480px; margin: auto;">
      <h2 style="color:#2e1a8f;">Thanks for your order, ${buyerName}!</h2>
      <p>Your purchase from the RMU SRC Marketplace has been confirmed.</p>
      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding:6px 0;color:#555;">Item</td><td style="text-align:right;">${itemName}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Quantity</td><td style="text-align:right;">${quantity}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Total Paid</td><td style="text-align:right;">GH₵ ${total}</td></tr>
        <tr><td style="padding:6px 0;color:#555;">Reference</td><td style="text-align:right;">${reference}</td></tr>
      </table>
      <p>The seller will reach out to arrange delivery/pickup on campus.</p>
    </div>
  `;
}
