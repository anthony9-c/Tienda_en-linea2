import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

let server, base;

before(async () => {
  const app = createApp({ dataDir: ":memory:" }); // base de datos temporal en memoria
  server = app.listen(0);
  base = `http://localhost:${server.address().port}/api`;
});
after(() => server.close());

const call = async (path, { method = "GET", body } = {}) => {
  const res = await fetch(base + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: res.status, data: await res.json() };
};
const cliente = { nombre: "Piero Camacho", correo: "piero@example.com" };

test("GET /health responde ok", async () => {
  const { status, data } = await call("/health");
  assert.equal(status, 200);
  assert.equal(data.status, "ok");
});

test("GET /products devuelve los 12 productos con el campo desc", async () => {
  const { data } = await call("/products");
  assert.equal(data.length, 12);
  assert.ok(data[0].desc);
});

test("GET /products filtra por categoría, busca por texto y ordena", async () => {
  const gaming = (await call("/products?category=Gaming")).data;
  assert.equal(gaming.length, 3);
  assert.ok(gaming.every((p) => p.categoria === "Gaming"));

  const mouse = (await call("/products?search=mouse")).data;
  assert.equal(mouse.length, 1);

  const asc = (await call("/products?sort=asc")).data.map((p) => p.precio);
  assert.deepEqual(asc, [...asc].sort((a, b) => a - b));
});

test("GET /products con orden inválido responde 400", async () => {
  const { status } = await call("/products?sort=xyz");
  assert.equal(status, 400);
});

test("GET /products/:id devuelve el producto, 404 si no existe y 400 si el id es inválido", async () => {
  assert.equal((await call("/products/1")).data.nombre, "Audífonos Bluetooth Pro");
  assert.equal((await call("/products/999")).status, 404);
  assert.equal((await call("/products/abc")).status, 400);
});

test("GET /categories devuelve las categorías sin repetir", async () => {
  const { data } = await call("/categories");
  assert.deepEqual(data, ["Accesorios", "Audio", "Computación", "Gaming", "Wearables"]);
});

test("POST /orders crea el pedido, calcula el total en el servidor y descuenta stock", async () => {
  const antes = (await call("/products/4")).data.stock;
  const { status, data } = await call("/orders", {
    method: "POST",
    body: { cliente, items: [{ productId: 4, cantidad: 2 }, { productId: 7, cantidad: 1 }], total: 1 }, // total falso: se ignora
  });
  assert.equal(status, 201);
  assert.equal(data.total, 279.7); // 2 × 99.90 + 79.90
  assert.equal(data.items.length, 2);
  assert.equal((await call("/products/4")).data.stock, antes - 2);

  const guardado = await call(`/orders/${data.id}`);
  assert.equal(guardado.data.cliente.correo, cliente.correo);
});

test("POST /orders con stock insuficiente responde 409 y no descuenta nada (transacción)", async () => {
  const stock1 = (await call("/products/1")).data.stock;
  const { status, data } = await call("/orders", {
    method: "POST",
    body: { cliente, items: [{ productId: 1, cantidad: 1 }, { productId: 5, cantidad: 50 }] },
  });
  assert.equal(status, 409);
  assert.match(data.error, /Stock insuficiente/);
  assert.equal((await call("/products/1")).data.stock, stock1); // la primera línea se revirtió
});

test("POST /orders valida los datos y responde 400 con el detalle", async () => {
  const { status, data } = await call("/orders", {
    method: "POST",
    body: { cliente: { nombre: "A", correo: "mal" }, items: [{ productId: 1, cantidad: 0 }] },
  });
  assert.equal(status, 400);
  assert.equal(data.details.length, 3);
});

test("POST /orders con producto inexistente responde 404", async () => {
  const { status } = await call("/orders", { method: "POST", body: { cliente, items: [{ productId: 999, cantidad: 1 }] } });
  assert.equal(status, 404);
});

test("POST /contact guarda el mensaje y valida los campos", async () => {
  const ok = await call("/contact", { method: "POST", body: { ...cliente, mensaje: "Hola, quisiera información." } });
  assert.equal(ok.status, 201);
  const mal = await call("/contact", { method: "POST", body: { nombre: "", correo: "x", mensaje: "corto" } });
  assert.equal(mal.status, 400);
});

test("Rutas inexistentes y JSON roto responden con el formato de error", async () => {
  assert.equal((await call("/nada")).status, 404);
  const res = await fetch(base + "/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{roto" });
  assert.equal(res.status, 400);
});
