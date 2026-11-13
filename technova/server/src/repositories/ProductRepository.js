import { conflict } from "../utils/AppError.js";

// La columna se llama "descripcion" en la BD; hacia afuera la API expone "desc".
const SELECT = "SELECT id, nombre, categoria, precio, stock, emoji, color, descripcion AS desc FROM products";

/** Acceso a datos de productos. Es la única clase que conoce el SQL de esta tabla. */
export class ProductRepository {
  constructor(db) {
    this.db = db;
  }

  findAll() {
    return this.db.prepare(`${SELECT} ORDER BY id`).all();
  }

  findById(id) {
    return this.db.prepare(`${SELECT} WHERE id = ?`).get(id) ?? null;
  }

  /**
   * Descuenta stock de varias líneas. El UPDATE condicional (stock >= cantidad) evita vender
   * de más aunque lleguen dos pedidos a la vez. Debe ejecutarse dentro de una transacción
   * para que, si una línea falla, se deshagan las anteriores.
   */
  reserveStock(lines) {
    const update = this.db.prepare("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?");
    for (const { productId, cantidad } of lines) {
      if (update.run(cantidad, productId, cantidad).changes === 0) {
        const p = this.findById(productId);
        throw conflict(`Stock insuficiente de "${p.nombre}". Disponible: ${p.stock}.`, {
          productId,
          disponible: p.stock,
        });
      }
    }
  }
}
