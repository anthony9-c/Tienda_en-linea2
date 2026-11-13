import { useState } from "react";
import { Offcanvas, Button, Form, Alert, Spinner } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import { orderService } from "../services/orderService.js";
import { moneda } from "../utils/format.js";

export default function CartDrawer({ show, onHide, onOrdered }) {
  const { items, total, inc, dec, clear } = useCart();
  const [paso, setPaso] = useState("carrito"); // carrito → datos → listo
  const [cliente, setCliente] = useState({ nombre: "", correo: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [pedido, setPedido] = useState(null);

  const cerrar = () => {
    onHide();
    if (paso === "listo") {
      setPaso("carrito");
      setPedido(null);
    }
  };

  const confirmar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const creado = await orderService.create(cliente, items); // POST /api/orders
      setPedido(creado);
      clear();
      setPaso("listo");
      onOrdered(); // refresca el catálogo para ver el stock descontado
    } catch (err) {
      setError({ mensaje: err.message, detalles: err.details });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Offcanvas show={show} onHide={cerrar} placement="end" aria-labelledby="carritoTitulo">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title as="h2" className="h5" id="carritoTitulo">
          {paso === "listo" ? "Pedido confirmado" : "Tu carrito"}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column">
        {paso === "listo" && pedido && (
          <div className="text-center my-auto" data-testid="pedido-ok">
            <div style={{ fontSize: "3rem" }}>🎉</div>
            <h3 className="h5">¡Gracias, {pedido.cliente.nombre}!</h3>
            <p className="mb-1">Tu pedido <strong>N.° {pedido.id}</strong> fue registrado.</p>
            <p className="fw-bold fs-5">Total: {moneda(pedido.total)}</p>
            <Button className="btn-accent" onClick={cerrar}>Seguir comprando</Button>
          </div>
        )}

        {paso !== "listo" && (
          <>
            <div className="flex-grow-1">
              {items.length === 0 && <p className="text-secondary text-center mt-4">Tu carrito está vacío 🛒</p>}
              {items.map((i) => (
                <div className="cart-item" key={i.id}>
                  <div className="cart-thumb" style={{ background: i.color }}>{i.emoji}</div>
                  <div>
                    <div className="fw-semibold small">{i.nombre}</div>
                    <div className="text-secondary small">{moneda(i.precio)} c/u</div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <Button variant="outline-secondary" size="sm" className="qty-btn" onClick={() => dec(i.id)} aria-label="Quitar uno">−</Button>
                      <span>{i.cantidad}</span>
                      <Button variant="outline-secondary" size="sm" className="qty-btn" onClick={() => inc(i.id)} disabled={i.cantidad >= i.stock} aria-label="Agregar uno">+</Button>
                    </div>
                  </div>
                  <div className="fw-bold">{moneda(i.precio * i.cantidad)}</div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between fw-bold fs-5 mb-3">
                <span>Total</span><span>{moneda(total)}</span>
              </div>

              {error && (
                <Alert variant="danger" className="small">
                  <strong>{error.mensaje}</strong>
                  {Array.isArray(error.detalles) && <ul className="mb-0 mt-1">{error.detalles.map((d) => <li key={d}>{d}</li>)}</ul>}
                </Alert>
              )}

              {paso === "carrito" ? (
                <div className="d-grid gap-2">
                  <Button className="btn-accent" disabled={items.length === 0} onClick={() => setPaso("datos")}>Finalizar compra</Button>
                  <Button variant="outline-danger" disabled={items.length === 0} onClick={clear}>Vaciar carrito</Button>
                </div>
              ) : (
                <Form onSubmit={confirmar}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">Nombre completo</Form.Label>
                    <Form.Control required minLength={3} value={cliente.nombre} onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="small">Correo electrónico</Form.Label>
                    <Form.Control type="email" required value={cliente.correo} onChange={(e) => setCliente({ ...cliente, correo: e.target.value })} />
                  </Form.Group>
                  <div className="d-grid gap-2">
                    <Button type="submit" className="btn-accent" disabled={enviando || items.length === 0}>
                      {enviando ? <Spinner size="sm" animation="border" /> : "Confirmar pedido"}
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setPaso("carrito")} disabled={enviando}>Volver al carrito</Button>
                  </div>
                </Form>
              )}
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}
