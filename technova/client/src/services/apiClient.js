// Cliente HTTP único: todas las peticiones a la API pasan por aquí.
// Centraliza la URL base, los encabezados JSON y el manejo de errores.
const BASE = import.meta.env.VITE_API_URL ?? "/api";

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "ApiError";
    this.status = status; // 0 = no hubo conexión con el servidor
    this.details = details;
  }
}

export async function request(path, { method = "GET", body, signal } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (e) {
    if (e.name === "AbortError") throw e; // petición cancelada a propósito
    throw new ApiError(0, "No se pudo conectar con el servidor. Verifica que esté encendido.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data?.error ?? "Error inesperado del servidor.", data?.details);
  return data;
}
