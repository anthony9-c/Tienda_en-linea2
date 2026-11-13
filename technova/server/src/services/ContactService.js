import { badRequest } from "../utils/AppError.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Reglas del formulario de contacto: valida y guarda el mensaje. */
export class ContactService {
  constructor(messageRepo) {
    this.messageRepo = messageRepo;
  }

  send({ nombre, correo, mensaje } = {}) {
    const errores = [];
    if (typeof nombre !== "string" || nombre.trim().length < 3) errores.push("nombre debe tener al menos 3 caracteres.");
    if (typeof correo !== "string" || !EMAIL.test(correo.trim())) errores.push("correo no es válido.");
    if (typeof mensaje !== "string" || mensaje.trim().length < 10) errores.push("mensaje debe tener al menos 10 caracteres.");
    if (errores.length) throw badRequest("El mensaje no es válido.", errores);
    return this.messageRepo.add({
      nombre: nombre.trim(),
      correo: correo.trim(),
      mensaje: mensaje.trim(),
      creadoEn: new Date().toISOString(),
    });
  }
}
