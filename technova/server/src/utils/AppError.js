/** Error controlado de la aplicación: lleva un código HTTP y detalles opcionales. */
export class AppError extends Error {
  constructor(status, message, details = undefined) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export const notFound = (msg = "Recurso no encontrado") => new AppError(404, msg);
export const badRequest = (msg, details) => new AppError(400, msg, details);
export const conflict = (msg, details) => new AppError(409, msg, details);
