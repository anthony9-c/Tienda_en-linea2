import { Card, Badge, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { moneda } from "../utils/format.js";

export default function ProductCard({ product, delay, onSelect }) {
  const { add, items } = useCart();
  const toast = useToast();
  const enCarrito = items.find((i) => i.id === product.id)?.cantidad ?? 0;
  const agotado = product.stock < 1;
  const limite = enCarrito >= product.stock;

  const agregar = () => {
    add(product);
    toast("Producto agregado al carrito ✅");
  };

  return (
    <Card as="article" className="product-card" style={{ animationDelay: `${delay}ms` }}>
      <div
        className="product-img"
        style={{ background: product.color }}
        role="button"
        tabIndex={0}
        aria-label={`Ver detalle de ${product.nombre}`}
        onClick={() => onSelect(product.id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect(product.id))}
      >
        {product.emoji}
      </div>
      <Card.Body className="d-flex flex-column">
        <Badge bg="secondary" className="badge-cat align-self-start mb-2">{product.categoria}</Badge>
        <Card.Title as="h3" className="h6">{product.nombre}</Card.Title>
        <p className="price mt-auto mb-1">{moneda(product.precio)}</p>
        <p className={`stock-tag mb-2 ${agotado ? "text-danger" : product.stock <= 5 ? "text-warning" : "text-secondary"}`}>
          {agotado ? "Agotado" : product.stock <= 5 ? `¡Últimas ${product.stock} unidades!` : `${product.stock} disponibles`}
        </p>
        <Button className="btn-accent w-100" onClick={agregar} disabled={agotado || limite}>
          {agotado ? "Sin stock" : limite ? "Máximo en carrito" : "Agregar al carrito"}
        </Button>
      </Card.Body>
    </Card>
  );
}
