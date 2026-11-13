/** Acceso a datos de pedidos (tablas orders y order_items). */
export class OrderRepository {
  constructor(db) {
    this.db = db;
  }

  /** Inserta el pedido con todas sus líneas y devuelve el pedido guardado. */
  add({ cliente, items, total, creadoEn }) {
    const { lastInsertRowid } = this.db
      .prepare("INSERT INTO orders (cliente_nombre, cliente_correo, total, creado_en) VALUES (?, ?, ?, ?)")
      .run(cliente.nombre, cliente.correo, total, creadoEn);
    const insertItem = this.db.prepare(
      "INSERT INTO order_items (order_id, product_id, nombre, precio_unitario, cantidad) VALUES (?, ?, ?, ?, ?)"
    );
    for (const i of items) insertItem.run(lastInsertRowid, i.productId, i.nombre, i.precioUnitario, i.cantidad);
    return this.findById(Number(lastInsertRowid));
  }

  findById(id) {
    const o = this.db.prepare("SELECT * FROM orders WHERE id = ?").get(id);
    if (!o) return null;
    const items = this.db
      .prepare(
        `SELECT product_id AS productId, nombre, precio_unitario AS precioUnitario, cantidad
         FROM order_items WHERE order_id = ? ORDER BY id`
      )
      .all(id);
    return {
      id: o.id,
      cliente: { nombre: o.cliente_nombre, correo: o.cliente_correo },
      items,
      total: o.total,
      creadoEn: o.creado_en,
    };
  }
}
