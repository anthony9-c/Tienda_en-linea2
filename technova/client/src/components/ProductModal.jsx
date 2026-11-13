import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { productService } from "../services/productService.js";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { moneda } from "../utils/format.js";

/** Pide el detalle del producto a la API (GET /products/:id) para mostrar el stock actualizado. */
export default function ProductModal({ productId, onHide }) {
  const [state, setState] = useState({ product: null, loading: false, error: null });
  const { add } = useCart();
  const toast = useToast();

  useEffect(() => {
    if (productId == null) return;
    const controller = new AbortController();
    setState({ product: null, loading: true, error: null });
    productService
      .get(productId, controller.signal)
      .then((product) => setState({ product, loading: false, error: null }))
      .catch((e) => e.name !== "AbortError" && setState({ product: null, loading: false, error: e.message }));
    return () => controller.abort();
  }, [productId]);

  const { product, loading, error } = state;
  return (
    <Modal show={productId != null} onHide={onHide} centered aria-labelledby="modalTitulo">
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5" id="modalTitulo">{product?.nombre ?? "Detalle del producto"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && <div className="text-center py-4"><Spinner animation="border" /></div>}
        {error && <Alert variant="danger">{error}</Alert>}
        {product && (
          <>
            <div className="product-img mb-3" style={{ background: product.color }}>{product.emoji}</div>
            <p>{product.desc}</p>
            <p className="fw-bold fs-4 text-accent mb-1">{moneda(product.precio)}</p>
            <p className="text-secondary mb-0">Stock disponible: {product.stock}</p>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Cerrar</Button>
        <Button
          className="btn-accent"
          disabled={!product || product.stock < 1}
          onClick={() => {
            add(product);
            toast("Producto agregado al carrito ✅");
            onHide();
          }}
        >
          Agregar al carrito
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
