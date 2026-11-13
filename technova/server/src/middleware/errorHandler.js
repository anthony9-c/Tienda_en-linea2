import { AppError } from "../utils/AppError.js";

/** Rutas /api que no existen. */
export function apiNotFound(req, _res, next) {
  next(new AppError(404, `La ruta ${req.method} ${req.originalUrl} no existe.`));
}

/** Manejador central: todos los errores salen con el mismo formato { error, details }. */
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message, details: err.details });
  }
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido." });
  }
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
}
