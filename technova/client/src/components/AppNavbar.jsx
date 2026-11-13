import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { useCart } from "../context/CartContext.jsx";

export default function AppNavbar({ tema, onToggleTema, onOpenCart }) {
  const { unidades } = useCart();
  return (
    <Navbar expand="lg" sticky="top" className="app-nav">
      <Container>
        <Navbar.Brand href="#inicio" className="fw-bold">
          ⚡ Tech<span className="text-accent">Nova</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu" aria-label="Abrir menú" />
        <Navbar.Collapse id="menu">
          <Nav className="me-auto">
            <Nav.Link href="#inicio">Inicio</Nav.Link>
            <Nav.Link href="#catalogo">Catálogo</Nav.Link>
            <Nav.Link href="#beneficios">Beneficios</Nav.Link>
            <Nav.Link href="#contacto">Contacto</Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-2">
            <Button variant="outline-secondary" size="sm" onClick={onToggleTema} aria-label="Cambiar entre modo claro y oscuro">
              {tema === "dark" ? "☀️" : "🌙"}
            </Button>
            <Button className="btn-accent position-relative" onClick={onOpenCart}>
              🛒 Carrito
              <Badge pill bg="danger" className="position-absolute top-0 start-100 translate-middle" data-testid="cart-badge">
                {unidades}
              </Badge>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
