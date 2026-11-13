-- Esquema de la base de datos de TechNova (SQLite)

CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY,
  nombre       TEXT    NOT NULL,
  categoria    TEXT    NOT NULL,
  precio       REAL    NOT NULL CHECK (precio >= 0),
  stock        INTEGER NOT NULL CHECK (stock >= 0),
  emoji        TEXT    NOT NULL,
  color        TEXT    NOT NULL,
  descripcion  TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_products_categoria ON products (categoria);

CREATE TABLE IF NOT EXISTS orders (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_nombre  TEXT NOT NULL,
  cliente_correo  TEXT NOT NULL,
  total           REAL NOT NULL,
  creado_en       TEXT NOT NULL
);

-- Un pedido tiene muchas líneas. Se guarda el nombre y el precio del momento de la compra
-- para que el historial no cambie si el producto se edita después.
CREATE TABLE IF NOT EXISTS order_items (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id         INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id       INTEGER NOT NULL REFERENCES products (id),
  nombre           TEXT    NOT NULL,
  precio_unitario  REAL    NOT NULL,
  cantidad         INTEGER NOT NULL CHECK (cantidad > 0)
);
CREATE INDEX IF NOT EXISTS idx_items_order ON order_items (order_id);

CREATE TABLE IF NOT EXISTS messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre     TEXT NOT NULL,
  correo     TEXT NOT NULL,
  mensaje    TEXT NOT NULL,
  creado_en  TEXT NOT NULL
);
