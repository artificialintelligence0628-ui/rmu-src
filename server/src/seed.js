import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { pool, query } from "./db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log("Running schema.sql ...");
  const schemaPath = path.join(__dirname, "../schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  await pool.query(schema);
  console.log("Schema applied.");

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@rmu.edu.gh").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.SEED_ADMIN_NAME || "SRC Admin";

  const { rows } = await query("SELECT id FROM admins WHERE email = $1", [email]);
  if (rows.length) {
    console.log(`Admin already exists: ${email}`);
  } else {
    const password_hash = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO admins (name, email, password_hash) VALUES ($1,$2,$3)",
      [name, email, password_hash]
    );
    console.log(`Seeded admin: ${email} / ${password}`);
  }

  // Seed a couple of default site_settings so the About/impact stats aren't empty
  const defaults = {
    students_represented: "5000+",
    countries_represented: "5",
    executive_portfolios: "7",
  };
  for (const [key, value] of Object.entries(defaults)) {
    await query(
      `INSERT INTO site_settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO NOTHING`,
      [key, value]
    );
  }

  console.log("Seed complete.");
  await pool.end();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
