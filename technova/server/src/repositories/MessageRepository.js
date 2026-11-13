/** Acceso a datos de los mensajes del formulario de contacto. */
export class MessageRepository {
  constructor(db) {
    this.db = db;
  }

  add({ nombre, correo, mensaje, creadoEn }) {
    const { lastInsertRowid } = this.db
      .prepare("INSERT INTO messages (nombre, correo, mensaje, creado_en) VALUES (?, ?, ?, ?)")
      .run(nombre, correo, mensaje, creadoEn);
    return { id: Number(lastInsertRowid), nombre, correo, mensaje, creadoEn };
  }
}
