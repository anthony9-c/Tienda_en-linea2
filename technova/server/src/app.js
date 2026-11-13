import fs from "node:fs";
import path from "node:path";
import express from "express";
import cors from "cors";
import { openDatabase } from "./db/database.js";
import { ProductRepository } from "./repositories/ProductRepository.js";
import { OrderRepository } from "./repositories/OrderRepository.js";
import { MessageRepository } from "./repositories/MessageRepository.js";
import { ProductService } from "./services/ProductService.js";
import { OrderService } from "./services/OrderService.js";
import { ContactService } from "./services/ContactService.js";
import { buildRouter } from "./routes/index.js";
import { apiNotFound, errorHandler } from "./middleware/errorHandler.js";

/**
 * Ensambla la aplicación: crea la BD, los repositorios, los servicios (inyectándoles sus
 * dependencias) y las rutas. Recibe la configuración como parámetro para poder probarla.
 */
export function createApp({ dataDir, clientDir } = {}) {
  const db = openDatabase(dataDir);

  const productRepo = new ProductRepository(db);
  const orderRepo = new OrderRepository(db);
  const messageRepo = new MessageRepository(db);

  const services = {
    productService: new ProductService(productRepo),
    orderService: new OrderService({
      productRepo,
      orderRepo,
      runInTransaction: (fn) => db.transaction(fn)(), // si algo falla dentro, se revierte todo
    }),
    contactService: new ContactService(messageRepo),
  };

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use("/api", buildRouter(services), apiNotFound);

  // En producción el mismo servidor entrega el frontend compilado.
  if (clientDir && fs.existsSync(path.join(clientDir, "index.html"))) {
    app.use(express.static(clientDir));
  }

  app.use(errorHandler);
  app.locals.db = db;
  return app;
}
