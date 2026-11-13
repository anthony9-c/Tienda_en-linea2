import { Router } from "express";
import { productController, orderController, contactController } from "../controllers/controllers.js";

/** Define los endpoints de la API y los conecta con sus controladores. */
export function buildRouter({ productService, orderService, contactService }) {
  const router = Router();
  const products = productController(productService);
  const orders = orderController(orderService);
  const contact = contactController(contactService);

  router.get("/health", (_req, res) => res.json({ status: "ok" }));

  router.get("/products", products.list);
  router.get("/products/:id", products.get);
  router.get("/categories", products.categories);

  router.post("/orders", orders.create);
  router.get("/orders/:id", orders.get);

  router.post("/contact", contact.send);

  return router;
}
