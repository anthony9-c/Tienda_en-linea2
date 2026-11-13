import { badRequest, notFound } from "../utils/AppError.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const redondear = (n) => Math.round(n * 100) / 100;

/**
 * Reglas de negocio de los pedidos. Es el servicio más importante porque protege la integridad:
 *  - valida los datos recibidos,
 *  - calcula el total con los precios de la BASE DE DATOS (nunca confía en el precio del cliente),
 *  - descuenta stock y guarda el pedido en una única transacción (todo o nada).
 */
export class OrderService {
  constructor({ productRepo, orderRepo, runInTransaction }) {
    this.productRepo = productRepo;
    this.orderRepo = orderRepo;
    this.runInTransaction = runInTransaction;
  }

  create(payload) {
    const errores = this.validate(payload);
    if (errores.length) throw badRequest("Los datos del pedido no son válidos.", errores);

    // Si el mismo producto llega dos veces, se suman las cantidades.
    const cantidades = new Map();
    for (const { productId, cantidad } of payload.items) {
      cantidades.set(productId, (cantidades.get(productId) ?? 0) + cantidad);
    }

    return this.runInTransaction(() => {
      const lines = [...cantidades].map(([productId, cantidad]) => {
        const p = this.productRepo.findById(productId);
        if (!p) throw notFound(`El producto ${productId} no existe.`);
        return { productId, nombre: p.nombre, precioUnitario: p.precio, cantidad };
      });
      this.productRepo.reserveStock(lines);
      const total = redondear(lines.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0));
      return this.orderRepo.add({
        cliente: { nombre: payload.cliente.nombre.trim(), correo: payload.cliente.correo.trim() },
        items: lines,
        total,
        creadoEn: new Date().toISOString(),
      });
    });
  }

  getById(id) {
    const order = this.orderRepo.findById(id);
    if (!order) throw notFound(`El pedido ${id} no existe.`);
    return order;
  }

  validate(p) {
    const errores = [];
    if (!p || typeof p !== "object") return ["Se esperaba un objeto JSON."];
    if (typeof p.cliente?.nombre !== "string" || p.cliente.nombre.trim().length < 3) {
      errores.push("cliente.nombre debe tener al menos 3 caracteres.");
    }
    if (typeof p.cliente?.correo !== "string" || !EMAIL.test(p.cliente.correo.trim())) {
      errores.push("cliente.correo no es un correo válido.");
    }
    if (!Array.isArray(p.items) || p.items.length === 0) {
      errores.push("items debe ser una lista con al menos un producto.");
    } else {
      p.items.forEach((i, n) => {
        if (!Number.isInteger(i?.productId)) errores.push(`items[${n}].productId debe ser un entero.`);
        if (!Number.isInteger(i?.cantidad) || i.cantidad < 1 || i.cantidad > 99) {
          errores.push(`items[${n}].cantidad debe ser un entero entre 1 y 99.`);
        }
      });
    }
    return errores;
  }
}
