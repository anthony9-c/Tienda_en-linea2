import { request } from "./apiClient.js";

export const orderService = {
  /** Envía el carrito al servidor. Solo manda ids y cantidades: el servidor calcula los precios. */
  create(cliente, cartItems) {
    const items = cartItems.map((i) => ({ productId: i.id, cantidad: i.cantidad }));
    return request("/orders", { method: "POST", body: { cliente, items } });
  },
  get: (id) => request(`/orders/${id}`),
};
