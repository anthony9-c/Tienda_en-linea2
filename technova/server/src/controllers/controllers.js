import { badRequest } from "../utils/AppError.js";

/** Convierte el parámetro :id de la URL en entero o responde 400. */
const parseId = (raw) => {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) throw badRequest("El id debe ser un entero positivo.");
  return id;
};

/**
 * Los controladores solo traducen HTTP ↔ servicios: leen la petición, llaman al servicio y
 * arman la respuesta. No contienen reglas de negocio ni SQL.
 */
export const productController = (service) => ({
  list: (req, res) => res.json(service.list(req.query)),
  get: (req, res) => res.json(service.getById(parseId(req.params.id))),
  categories: (_req, res) => res.json(service.categories()),
});

export const orderController = (service) => ({
  create: (req, res) => res.status(201).json(service.create(req.body)),
  get: (req, res) => res.json(service.getById(parseId(req.params.id))),
});

export const contactController = (service) => ({
  send: (req, res) => res.status(201).json(service.send(req.body)),
});
