import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";

const here = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA = fs.readFileSync(path.join(here, "schema.sql"), "utf8");
const SEED = path.join(here, "..", "..", "data", "products.seed.json");

/**
 * Abre la base de datos SQLite, crea las tablas si no existen y carga el catálogo inicial.
 * Con dataDir = ":memory:" se usa una base temporal (útil para pruebas).
 */
export function openDatabase(dataDir) {
  let file = ":memory:";
  if (dataDir !== ":memory:") {
    fs.mkdirSync(dataDir, { recursive: true });
    file = path.join(dataDir, "technova.db");
  }
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON"); // SQLite no activa las llaves foráneas por defecto
  db.exec(SCHEMA);
  seedProducts(db);
  return db;
}

function seedProducts(db) {
  const { total } = db.prepare("SELECT COUNT(*) AS total FROM products").get();
  if (total > 0) return;
  const products = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const insert = db.prepare(
    `INSERT INTO products (id, nombre, categoria, precio, stock, emoji, color, descripcion)
     VALUES (@id, @nombre, @categoria, @precio, @stock, @emoji, @color, @desc)`
  );
  db.transaction((rows) => rows.forEach((r) => insert.run(r)))(products);
}
